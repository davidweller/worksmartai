// Deploy with: supabase functions deploy send-schools-lead-notification
// Set secret with: supabase secrets set RESEND_API_KEY=your_key_here
// Optional: supabase secrets set FOUNDERS_NOTIFICATION_EMAIL=hello@worksmart-ai.co.uk

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const DEFAULT_NOTIFY_EMAIL = 'hello@worksmart-ai.co.uk';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isPlausibleEmail(s: string): boolean {
  if (s.length < 3 || s.length > 320) return false;
  const at = s.indexOf('@');
  if (at <= 0 || at === s.length - 1) return false;
  const rest = s.slice(at + 1);
  return rest.includes('.') && !rest.startsWith('.') && !rest.endsWith('.');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  const key = Deno.env.get('RESEND_API_KEY');
  if (!key || !String(key).trim()) {
    return json({ ok: false, error: 'Email service not configured' }, 503);
  }

  let payload: {
    name?: string;
    email?: string;
    school_org?: string;
    role?: string;
    message?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim().slice(0, 200) : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase().slice(0, 320) : '';
  const schoolOrg = typeof payload.school_org === 'string' ? payload.school_org.trim().slice(0, 300) : '';
  const role = typeof payload.role === 'string' ? payload.role.trim().slice(0, 120) : '';
  const message = typeof payload.message === 'string' ? payload.message.trim().slice(0, 2000) : '';

  if (!name) return json({ ok: false, error: 'Name is required' }, 400);
  if (!email || !isPlausibleEmail(email)) return json({ ok: false, error: 'A valid email is required' }, 400);
  if (!schoolOrg) return json({ ok: false, error: 'School or trust is required' }, 400);

  const notifyTo = (Deno.env.get('FOUNDERS_NOTIFICATION_EMAIL') || DEFAULT_NOTIFY_EMAIL).trim();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeOrg = escapeHtml(schoolOrg);
  const safeRole = escapeHtml(role || 'Not specified');
  const safeMessage = escapeHtml(message || 'None provided');

  const internalHtml = [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>`,
    `<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;">`,
    `<h2 style="margin:0 0 16px;">New schools enquiry</h2>`,
    `<p><strong>Name:</strong> ${safeName}</p>`,
    `<p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>`,
    `<p><strong>School / trust:</strong> ${safeOrg}</p>`,
    `<p><strong>Role:</strong> ${safeRole}</p>`,
    `<p><strong>Message:</strong><br/>${safeMessage.replace(/\n/g, '<br/>')}</p>`,
    `</body></html>`,
  ].join('');

  const notifyRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WorkSmart-AI <hello@worksmart-ai.co.uk>',
      to: [notifyTo],
      reply_to: email,
      subject: `New schools enquiry: ${schoolOrg}`,
      html: internalHtml,
    }),
  });

  if (!notifyRes.ok) {
    const errText = await notifyRes.text();
    return json({ ok: false, error: errText || 'Resend request failed' }, 502);
  }

  const autoReplyHtml = [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>`,
    `<body style="margin:0;padding:24px;font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;">`,
    `<p>Hi ${safeName},</p>`,
    `<p>Thank you for getting in touch about AI training for ${safeOrg}. We have received your enquiry and will be in touch shortly to arrange a 20-minute call.</p>`,
    `<p>If you need to reach us sooner, reply to this email or contact us at hello@worksmart-ai.co.uk.</p>`,
    `<p>The WorkSmart-AI Team</p>`,
    `</body></html>`,
  ].join('');

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WorkSmart-AI <hello@worksmart-ai.co.uk>',
      to: [email],
      subject: 'We received your schools enquiry - WorkSmart-AI',
      html: autoReplyHtml,
    }),
  });

  return json({ ok: true });
});
