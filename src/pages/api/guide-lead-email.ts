import type { APIRoute } from 'astro';

export const prerender = false;

const FROM = 'WorkSmart-AI <hello@worksmart-ai.co.uk>';
const PDF_PATH = '/higher-education-guide.pdf';

function getSiteBaseUrl(request: Request): string {
  const fromEnv = import.meta.env.PUBLIC_SITE_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return String(fromEnv).replace(/\/$/, '');
  }
  const forwarded = request.headers.get('x-forwarded-host');
  const host = forwarded || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  if (host) {
    return `${proto}://${host}`.replace(/\/$/, '');
  }
  return new URL(request.url).origin;
}

function isPlausibleEmail(s: string): boolean {
  if (s.length < 3 || s.length > 320) return false;
  const at = s.indexOf('@');
  if (at <= 0 || at === s.length - 1) return false;
  const rest = s.slice(at + 1);
  return rest.includes('.') && !rest.startsWith('.') && !rest.endsWith('.');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request }) => {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key || !String(key).trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'Email delivery is not configured.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { name?: string; email?: string };
  try {
    body = (await request.json()) as { name?: string; email?: string };
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 320) : '';

  if (!name) {
    return new Response(JSON.stringify({ ok: false, error: 'Name is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!email || !isPlausibleEmail(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'A valid work email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const base = getSiteBaseUrl(request);
  const downloadUrl = `${base}${PDF_PATH}`;
  const safeName = escapeHtml(name);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: 'Your higher education guide — download link',
      html: [
        `<p>Hi ${safeName},</p>`,
        '<p>Thanks for requesting the WorkSmart-AI <strong>Higher education AI workflow</strong> guide.</p>',
        `<p>Download your PDF: <a href="${downloadUrl}">${downloadUrl}</a></p>`,
        '<p>If the button or link does not work, copy the address into your browser.</p>',
        '<p>— WorkSmart-AI</p>',
      ].join(''),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return new Response(JSON.stringify({ ok: false, error: 'Could not send email.', detail: errText }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
