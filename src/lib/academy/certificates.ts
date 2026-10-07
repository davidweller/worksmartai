import { academySupabase } from '~/lib/academy';
import { escapeHtml } from '~/lib/academy/courses';
import { getSupabaseAnonKey, getSupabaseUrl } from '~/lib/supabase/env';

// Course completion certificates, issued and rendered by the `certificate` Edge Function.
// The dialog here is shared by the course player (Finish course) and the dashboard (View certificate).

export type Certificate = {
  id: string;
  cert_code: string;
  course_id: string;
  learner_name: string;
  course_title: string;
  issued_at: string;
};

export type CertificateStatus = {
  eligible: boolean;
  pageCount: number;
  missingPages: number[];
  scorePercent: number;
  passMark: number;
  certificate: Certificate | null;
};

async function accessToken(): Promise<string> {
  if (!academySupabase) throw new Error('Missing Supabase configuration.');
  const { data, error } = await academySupabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error('Your session has expired. Please sign in again.');
  return data.session.access_token;
}

async function callCertificate(body: Record<string, unknown>): Promise<Response> {
  return fetch(`${getSupabaseUrl().replace(/\/$/, '')}/functions/v1/certificate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await accessToken()}`,
      apikey: getSupabaseAnonKey(),
    },
    body: JSON.stringify(body),
  });
}

async function callCertificateJson<T>(body: Record<string, unknown>): Promise<T> {
  const res = await callCertificate(body);
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export function getCertificateStatus(courseId: string): Promise<CertificateStatus> {
  return callCertificateJson<CertificateStatus>({ action: 'status', courseId });
}

export function claimCertificate(courseId: string, name: string): Promise<CertificateStatus> {
  return callCertificateJson<CertificateStatus>({ action: 'claim', courseId, name });
}

export async function fetchCertificatePdfUrl(certificateId: string): Promise<string> {
  const res = await callCertificate({ action: 'pdf', certificateId });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || `Could not load the certificate (${res.status})`);
  }
  return URL.createObjectURL(await res.blob());
}

export function certificateFileName(courseTitle: string): string {
  return `${courseTitle.replace(/[\\/:*?"<>|]+/g, '').trim()} – Certificate.pdf`;
}

// ---------- Dialog ----------

const STYLE_ID = 'academy-cert-style';
const CSS = `
.academy-cert-backdrop{position:fixed;inset:0;z-index:100;background:rgb(0 0 0/.55);display:flex;align-items:center;justify-content:center;padding:16px}
.academy-cert-dialog{background:#fff;color:#1b0101;border-radius:16px;box-shadow:0 20px 50px rgb(0 0 0/.3);width:100%;max-width:520px;max-height:calc(100vh - 32px);overflow:auto;padding:28px;font-family:'Ubuntu',sans-serif}
.academy-cert-dialog.is-wide{max-width:960px}
.academy-cert-dialog h2{margin:0 0 8px;font-family:'Work Sans',sans-serif;font-size:24px;font-weight:700;color:#015887}
.academy-cert-dialog p{margin:0 0 14px;font-size:15px;line-height:1.5}
.academy-cert-dialog label{display:block;font-size:14px;font-weight:700;margin-bottom:6px}
.academy-cert-dialog input{width:100%;border:1px solid #c8c8c8;border-radius:8px;padding:10px 12px;font-size:16px}
.academy-cert-hint{font-size:13px!important;color:#666;margin-top:6px!important}
.academy-cert-error{color:#991b1b;font-size:14px!important}
.academy-cert-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:20px}
.academy-cert-btn{border-radius:10px;padding:10px 18px;font-size:14px;font-weight:700;cursor:pointer;border:1px solid #015887;background:#fff;color:#015887;text-decoration:none;display:inline-flex;align-items:center}
.academy-cert-btn-primary{background:#ff7700;border-color:#ff7700;color:#fff}
.academy-cert-btn:disabled{opacity:.5;cursor:wait}
.academy-cert-btn[aria-disabled="true"]{opacity:.5;pointer-events:none}
.academy-cert-frame{width:100%;height:min(70vh,640px);border:1px solid #e0e0e0;border-radius:8px}
.academy-cert-list{margin:0 0 14px;padding-left:20px;font-size:15px}
.academy-cert-list button{background:none;border:none;padding:0;color:#015887;text-decoration:underline;cursor:pointer;font-size:15px}
`;

type Dialog = { root: HTMLElement; body: HTMLElement; close: () => void };

function openDialog(onClose?: () => void): Dialog {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  const root = document.createElement('div');
  root.className = 'academy-cert-backdrop';
  root.innerHTML = '<div class="academy-cert-dialog" role="dialog" aria-modal="true"></div>';
  const body = root.firstElementChild as HTMLElement;

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  const close = () => {
    document.removeEventListener('keydown', onKey);
    root.remove();
    onClose?.();
  };
  document.addEventListener('keydown', onKey);
  root.addEventListener('click', (event) => {
    if (event.target === root) close();
  });
  document.body.appendChild(root);
  return { root, body, close };
}

function bindClose(dialog: Dialog) {
  dialog.body.querySelectorAll('[data-cert-close]').forEach((el) => el.addEventListener('click', dialog.close));
}

const DASHBOARD_HREF = '/academy/dashboard/';

// The actions show straight away; View and Download wait for the PDF. The Finish course flow
// also offers the way back to the dashboard, which is pointless on the dashboard itself.
async function showCertificate(
  dialog: Dialog,
  certificate: Certificate,
  heading: string,
  intro: string,
  options: { backToDashboard?: boolean } = {}
) {
  dialog.body.classList.add('is-wide');
  dialog.body.setAttribute('aria-label', heading);
  dialog.body.innerHTML = `
    <h2>${escapeHtml(heading)}</h2>
    <p>${intro}</p>
    <p data-cert-loading>Preparing your certificate…</p>
    <div class="academy-cert-actions">
      ${
        options.backToDashboard
          ? `<a class="academy-cert-btn" href="${DASHBOARD_HREF}">Back to dashboard</a>`
          : '<button type="button" class="academy-cert-btn" data-cert-close>Close</button>'
      }
      <a class="academy-cert-btn" data-cert-view target="_blank" rel="noopener" aria-disabled="true">View certificate</a>
      <a class="academy-cert-btn academy-cert-btn-primary" data-cert-download aria-disabled="true">Download PDF</a>
    </div>`;
  bindClose(dialog);

  try {
    const url = await fetchCertificatePdfUrl(certificate.id);
    const prevClose = dialog.close;
    dialog.close = () => {
      URL.revokeObjectURL(url);
      prevClose();
    };
    dialog.body.querySelector('[data-cert-loading]')?.replaceWith(
      Object.assign(document.createElement('iframe'), {
        className: 'academy-cert-frame',
        src: url,
        title: `Certificate for ${certificate.course_title}`,
      })
    );
    const view = dialog.body.querySelector<HTMLAnchorElement>('[data-cert-view]');
    const download = dialog.body.querySelector<HTMLAnchorElement>('[data-cert-download]');
    if (view) {
      view.href = url;
      view.removeAttribute('aria-disabled');
    }
    if (download) {
      download.href = url;
      download.download = certificateFileName(certificate.course_title);
      download.removeAttribute('aria-disabled');
    }
  } catch (caught) {
    const loading = dialog.body.querySelector('[data-cert-loading]');
    if (loading) {
      loading.className = 'academy-cert-error';
      loading.textContent = caught instanceof Error ? caught.message : 'Could not load the certificate.';
    }
    dialog.body.querySelectorAll('[data-cert-view], [data-cert-download]').forEach((el) => el.remove());
  }
}

export function openCertificateDialog(certificate: Certificate) {
  const dialog = openDialog();
  void showCertificate(
    dialog,
    certificate,
    'Your certificate',
    `<strong>${escapeHtml(certificate.course_title)}</strong>, issued to ${escapeHtml(certificate.learner_name)}.`
  );
}

function pageList(missing: number[], pageTitles: string[]): string {
  return missing
    .map(
      (i) =>
        `<li><button type="button" data-cert-goto="${i}">${escapeHtml(pageTitles[i] ?? `Page ${i + 1}`)}</button></li>`
    )
    .join('');
}

// The Finish course flow: check completion, ask for the name, issue, then show the certificate.
export async function openFinishDialog(options: {
  courseId: string;
  courseTitle: string;
  pageTitles: string[];
  defaultName: string;
  goToPage: (index: number) => void;
  onIssued?: (certificate: Certificate) => void;
}) {
  const dialog = openDialog();
  dialog.body.setAttribute('aria-label', 'Finish course');
  dialog.body.innerHTML = '<p>Checking your progress…</p>';

  let status: CertificateStatus;
  try {
    status = await getCertificateStatus(options.courseId);
  } catch (caught) {
    dialog.body.innerHTML = `
      <h2>Something went wrong</h2>
      <p class="academy-cert-error">${escapeHtml(caught instanceof Error ? caught.message : 'Could not check your progress.')}</p>
      <div class="academy-cert-actions"><button type="button" class="academy-cert-btn" data-cert-close>Close</button></div>`;
    bindClose(dialog);
    return;
  }

  const title = escapeHtml(options.courseTitle);

  if (status.certificate) {
    void showCertificate(dialog, status.certificate, 'Well done!', `You've finished <strong>${title}</strong>.`, {
      backToDashboard: true,
    });
    return;
  }

  if (!status.eligible) {
    const pagesMissing = status.missingPages.length > 0;
    const scoreShort = status.scorePercent < status.passMark;
    dialog.body.innerHTML = `
      <h2>Almost there</h2>
      <p>You need to finish a little more of <strong>${title}</strong> before you can claim your certificate.</p>
      ${pagesMissing ? `<p>Modules you haven't opened yet:</p><ul class="academy-cert-list">${pageList(status.missingPages, options.pageTitles)}</ul>` : ''}
      ${scoreShort ? `<p>Your quiz score is ${status.scorePercent}%. The pass mark is ${status.passMark}%. Go back and review your answers to raise it.</p>` : ''}
      <div class="academy-cert-actions"><button type="button" class="academy-cert-btn academy-cert-btn-primary" data-cert-close>OK</button></div>`;
    bindClose(dialog);
    dialog.body.querySelectorAll<HTMLElement>('[data-cert-goto]').forEach((el) =>
      el.addEventListener('click', () => {
        dialog.close();
        options.goToPage(Number(el.dataset.certGoto));
      })
    );
    return;
  }

  dialog.body.innerHTML = `
    <h2>Well done!</h2>
    <p>You've finished <strong>${title}</strong>. Claim your certificate below.</p>
    <form data-cert-form novalidate>
      <label for="academy-cert-name">Your full name</label>
      <input id="academy-cert-name" name="name" autocomplete="name" maxlength="80" required value="${escapeHtml(options.defaultName)}" />
      <p class="academy-cert-hint">This is how your name will appear on the certificate. Check it carefully – it can't be changed once issued.</p>
      <p class="academy-cert-error" data-cert-error hidden></p>
      <div class="academy-cert-actions">
        <button type="button" class="academy-cert-btn" data-cert-close>Not now</button>
        <button type="submit" class="academy-cert-btn academy-cert-btn-primary">Claim certificate</button>
      </div>
    </form>`;
  bindClose(dialog);

  const form = dialog.body.querySelector<HTMLFormElement>('[data-cert-form]')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const errorEl = form.querySelector<HTMLElement>('[data-cert-error]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  input.focus();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = input.value.replace(/\s+/g, ' ').trim();
    if (name.length < 2) {
      errorEl.textContent = 'Enter your full name.';
      errorEl.hidden = false;
      return;
    }
    submit.disabled = true;
    errorEl.hidden = true;
    try {
      const result = await claimCertificate(options.courseId, name);
      if (!result.certificate) throw new Error('The certificate was not issued. Please try again.');
      options.onIssued?.(result.certificate);
      void showCertificate(
        dialog,
        result.certificate,
        'Your certificate',
        `Congratulations, ${escapeHtml(result.certificate.learner_name)}. It's saved to your account – you can open it again from your dashboard.`,
        { backToDashboard: true }
      );
    } catch (caught) {
      errorEl.textContent = caught instanceof Error ? caught.message : 'Could not issue the certificate.';
      errorEl.hidden = false;
      submit.disabled = false;
    }
  });
}
