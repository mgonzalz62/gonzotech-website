/**
 * GonzoTech — Contact Form Handler
 * Cloudflare Pages Function: POST /contact
 *
 * Required environment variable (set in Cloudflare Pages → Settings → Variables):
 *   RESEND_API_KEY  →  re_xxxxxxxxxxxx  (from resend.com)
 *
 * Sending domain: contact@gonzotech.us  (verify gonzotech.us in Resend dashboard)
 */

const RECIPIENT   = 'mike@gonzotech.us';
const SENDER      = 'GonzoTech Contact <contact@gonzotech.us>';
const ALLOWED_ORIGIN = 'https://gonzotech.us';

export async function onRequestPost(context) {
    const { request, env } = context;

    // ── CORS headers ────────────────────────────────────────────────────────
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    };

    // ── Parse body ───────────────────────────────────────────────────────────
    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json({ success: false, error: 'Invalid request body.' }, { status: 400, headers });
    }

    const name    = (body.name    || '').trim();
    const email   = (body.email   || '').trim();
    const message = (body.message || '').trim();

    // ── Validate ─────────────────────────────────────────────────────────────
    if (!name || !email || !message) {
        return Response.json({ success: false, error: 'All fields are required.' }, { status: 400, headers });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json({ success: false, error: 'Invalid email address.' }, { status: 400, headers });
    }

    if (message.length > 5000) {
        return Response.json({ success: false, error: 'Message too long (5000 char max).' }, { status: 400, headers });
    }

    // ── Check API key ────────────────────────────────────────────────────────
    if (!env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return Response.json({ success: false, error: 'Server misconfiguration.' }, { status: 500, headers });
    }

    // ── Build email HTML ─────────────────────────────────────────────────────
    const safeMessage = message
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; background:#0f172a; color:#cbd5e1; padding:32px; margin:0;">
  <div style="max-width:560px; margin:0 auto; background:#1e293b; border:1px solid #334155; border-radius:10px; overflow:hidden;">
    <div style="background:linear-gradient(90deg,#3b82f6,#a855f7); height:3px;"></div>
    <div style="padding:28px 32px;">
      <p style="font-size:11px; font-weight:600; color:#3b82f6; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 8px;">New message via gonzotech.us</p>
      <h2 style="font-size:20px; font-weight:700; color:#f1f5f9; margin:0 0 24px; letter-spacing:-0.3px;">Contact Form Submission</h2>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <tr>
          <td style="padding:10px 0; border-bottom:1px solid #334155; color:#64748b; font-size:13px; font-weight:500; width:80px;">From</td>
          <td style="padding:10px 0; border-bottom:1px solid #334155; color:#f1f5f9; font-size:13px;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0; border-bottom:1px solid #334155; color:#64748b; font-size:13px; font-weight:500;">Reply-To</td>
          <td style="padding:10px 0; border-bottom:1px solid #334155; font-size:13px;"><a href="mailto:${email}" style="color:#3b82f6; text-decoration:none;">${email}</a></td>
        </tr>
      </table>
      <p style="font-size:13px; font-weight:500; color:#64748b; margin:0 0 8px;">Message</p>
      <div style="background:#0f172a; border:1px solid #334155; border-radius:6px; padding:16px; font-size:14px; line-height:1.7; color:#cbd5e1;">${safeMessage}</div>
      <p style="font-size:11px; color:#334155; margin:20px 0 0; text-align:center;">GonzoTech · gonzotech.us</p>
    </div>
  </div>
</body>
</html>`;

    // ── Send via Resend ──────────────────────────────────────────────────────
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from:     SENDER,
                to:       [RECIPIENT],
                reply_to: email,
                subject:  `Message from ${name} — gonzotech.us`,
                html,
                text: `From: ${name} <${email}>\n\n${message}`,
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('Resend error:', err);
            return Response.json({ success: false, error: 'Failed to send — try again later.' }, { status: 502, headers });
        }

        return Response.json({ success: true }, { headers });

    } catch (err) {
        console.error('Fetch error:', err);
        return Response.json({ success: false, error: 'Network error — try again later.' }, { status: 500, headers });
    }
}

// ── Handle preflight CORS ────────────────────────────────────────────────────
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
