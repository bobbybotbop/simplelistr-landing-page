export function waitlistConfirmationHtml(email: string): string {
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body style="background:#ffffff;font-family:sans-serif;margin:0;padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;padding:40px 20px;">
      <tr><td>
        <h1 style="font-size:24px;font-weight:600;color:#111111;margin:0 0 16px;">
          You&apos;re on the list.
        </h1>
        <p style="font-size:16px;color:#555555;line-height:1.6;margin:0 0 16px;">
          We&apos;ve saved your spot for <strong style="color:#111111;">${email}</strong>.
        </p>
        <p style="font-size:16px;color:#555555;line-height:1.6;margin:0 0 40px;">
          We&apos;ll reach out when SimpleListr is ready to launch. Thanks for your
          patience &mdash; we&apos;re building something worth waiting for.
        </p>
        <p style="font-size:12px;color:#999999;margin:0;">
          SimpleListr &middot; You&apos;re receiving this because you joined the waitlist.
        </p>
      </td></tr>
    </table>
  </body>
</html>`;
}
