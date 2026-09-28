const BRAND = 'mojkmet.eu'

export function renderLayout(opts: {
  title: string
  preheader?: string
  bodyHtml: string
}): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${opts.preheader}</div>`
    : ''
  return `<!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${opts.title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    ${preheader}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:0 0 16px 0;text-align:center;">
                <a href="https://${BRAND}" style="text-decoration:none;color:#166534;font-size:22px;font-weight:bold;letter-spacing:-0.02em;">
                  ${BRAND}
                </a>
              </td>
            </tr>
            <tr>
              <td style="background-color:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:32px 32px 24px 32px;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 8px 0 8px;text-align:center;color:#9ca3af;font-size:12px;line-height:1.5;">
                <p style="margin:0 0 6px 0;color:#6b7280;">
                  ${BRAND} — sveže iz kmetije, naravnost k vam.
                </p>
                <p style="margin:0;">
                  <a href="https://${BRAND}" style="color:#16a34a;text-decoration:none;">${BRAND}</a>
                  &nbsp;·&nbsp; <a href="https://${BRAND}/help" style="color:#16a34a;text-decoration:none;">Pomoč</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export const emailTextFooter = `\n\n—\n${BRAND}\nSveže iz kmetije, naravnost k vam.\nhttps://${BRAND}`