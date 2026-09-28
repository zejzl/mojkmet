import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { rateLimit } from '@/lib/rate-limit'
import { contactSchema, parseJson, escapeHtml } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson(contactSchema, request)
    if (!parsed.ok) return parsed.error

    const { name, email, subject, message } = parsed.data

    if (!rateLimit(request, 'contact', 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Preveč sporočil. Poskusite ponovno pozneje.' },
        { status: 429 }
      )
    }

    const nowLabel = new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' })
    const safeSubject = subject.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ')

    await sendMail({
      to: 'info@mojkmet.eu',
      subject: `[Kontakt] ${safeSubject} - ${name}`,
      text: `Novo sporočilo s kontaktne strani mojkmet.eu\n\nIme: ${name}\nE-pošta: ${email}\nZadeva: ${subject}\nDatum: ${nowLabel}\n\nSporočilo:\n${message}\n\n---\nPoslano prek https://mojkmet.eu/contact`,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16a34a;">Novo sporočilo s kontaktne strani</h2>
  <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
    <tr><td style="padding: 4px 0; color: #6b7280; width: 140px;">Ime:</td><td style="padding: 4px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
    <tr><td style="padding: 4px 0; color: #6b7280;">E-pošta:</td><td style="padding: 4px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding: 4px 0; color: #6b7280;">Zadeva:</td><td style="padding: 4px 0;"><strong>${escapeHtml(subject)}</strong></td></tr>
    <tr><td style="padding: 4px 0; color: #6b7280;">Datum:</td><td style="padding: 4px 0;">${nowLabel}</td></tr>
  </table>
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; white-space: pre-wrap;">${escapeHtml(message)}</div>
  <br>
  <p style="color: #9ca3af; font-size: 12px;">Poslano prek https://mojkmet.eu/contact</p>
</div>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
