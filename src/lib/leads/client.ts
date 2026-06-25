export interface LeadPayload {
  name?: string;
  email: string;
  source: string;
  school_org?: string;
  role?: string;
  message?: string;
}

export interface LeadSubmitConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  notificationUrl?: string;
}

export interface LeadSubmitResult {
  ok: boolean;
  status?: number;
  errorMessage?: string;
}

function parseErrorDetail(text: string, status: number): string {
  let detail = text;
  try {
    if (text) {
      const j = JSON.parse(text) as Record<string, unknown>;
      const errStr =
        typeof j.error === 'string'
          ? j.error
          : j.error && typeof j.error === 'object'
            ? String((j.error as { message?: string }).message || JSON.stringify(j.error))
            : undefined;
      detail = String(j.message || j.hint || j.details || errStr || text);
    }
  } catch {
    // keep raw text
  }

  const d = String(detail || '').toLowerCase();
  const looksRls = d.includes('row-level security') || d.includes('new row violates');

  if (status === 401) {
    return 'We could not verify the site with the form service. Please try again later or contact us.';
  }
  if (status === 403 || looksRls) {
    return 'The database is blocking new sign-ups. Please contact us directly.';
  }
  if (status === 400) {
    return 'Could not save your details. Check your entries and try again.';
  }
  if (status >= 500) {
    return 'The service is temporarily unavailable. Please try again in a few minutes.';
  }
  return 'Something went wrong. Please try again or contact us.';
}

export async function submitLead(config: LeadSubmitConfig, payload: LeadPayload): Promise<LeadSubmitResult> {
  const baseUrl = config.supabaseUrl.replace(/\/$/, '');
  const restUrl = `${baseUrl}/rest/v1/leads`;

  const res = await fetch(restUrl, {
    method: 'POST',
    headers: {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${config.supabaseAnonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, status: res.status, errorMessage: parseErrorDetail(text, res.status) };
  }

  if (config.notificationUrl) {
    try {
      await fetch(config.notificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          apikey: config.supabaseAnonKey,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      // Lead saved; notification failure is non-blocking
    }
  }

  return { ok: true };
}
