// Deploy with: supabase functions deploy send-guide-email
// Set secret with: supabase secrets set RESEND_API_KEY=your_key_here

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const DOWNLOAD_URL = 'https://worksmart-ai.co.uk/WorkSmart-AI%20-%20From%20Chatbot%20to%20Workflows.pdf';
const BOOKING_URL = 'https://new.worksmart-ai.co.uk/book-a-call/';

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

  let payload: { name?: string; email?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim().slice(0, 200) : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase().slice(0, 320) : '';

  if (!name) {
    return json({ ok: false, error: 'Name is required' }, 400);
  }
  if (!email || !isPlausibleEmail(email)) {
    return json({ ok: false, error: 'A valid email is required' }, 400);
  }

  const safeName = escapeHtml(name);
  const html = [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>`,
    `<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;background:#f8fafc;">`,
    `<div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,36,56,0.08);">`,
    `<p style="margin:0 0 16px;">Hi ${safeName},</p>`,
    `<p style="margin:0 0 16px;">Thank you for downloading our guide - we hope it gives you some practical ideas for how AI can save time and add real value across your institution.</p>`,
    `<p style="margin:0 0 20px;">`,
    `<a href="${DOWNLOAD_URL}" style="display:inline-block;background:#0d4f6b;color:#ffffff;font-weight:600;text-decoration:none;padding:10px 16px;border-radius:8px;">Download your guide here &rarr;</a>`,
    `</p>`,
    `<p style="margin:0 0 16px;">Whether you're just starting to explore AI or already have initiatives underway, the guide covers some of the most impactful use cases we've seen working with higher education teams - from reducing admin overhead to supporting student-facing services.</p>`,
    `<p style="margin:0 0 16px;">If anything in the guide sparks a question, or you'd like to talk through how any of these ideas could work at your university, we'd love to hear from you.</p>`,
    `<p style="margin:0 0 8px;">You can:</p>`,
    `<p style="margin:0 0 8px;">Book a free 30-minute call - <a href="${BOOKING_URL}" style="color:#0d4f6b;font-weight:600;">${BOOKING_URL}</a></p>`,
    `<p style="margin:0 0 20px;">Email us directly at <a href="mailto:hello@worksmart-ai.co.uk" style="color:#0d4f6b;font-weight:600;">hello@worksmart-ai.co.uk</a></p>`,
    `<p style="margin:0 0 8px;font-size:14px;color:#64748b;">If the download link does not work, copy and paste this address into your browser:</p>`,
    `<p style="margin:0 0 20px;font-size:13px;word-break:break-all;color:#0d4f6b;">${DOWNLOAD_URL}</p>`,
    `<p style="margin:0 0 4px;">Thanks again for your interest, and we look forward to connecting.</p>`,
    `<p style="margin:0;">The WorkSmart-AI Team<br/><a href="https://worksmart-ai.co.uk" style="color:#0d4f6b;">worksmart-ai.co.uk</a></p>`,
    `</div></body></html>`,
  ].join('');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WorkSmart-AI <hello@worksmart-ai.co.uk>',
      to: [email],
      subject: 'Your free guide: AI Use Cases for Higher Education Staff',
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return json({ ok: false, error: errText || 'Resend request failed' }, 502);
  }

  return json({ ok: true });
});
