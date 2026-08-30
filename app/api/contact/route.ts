import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { rateLimit } from '@/lib/rate-limit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactMessage = {
  name: string
  email: string
  subject: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactMessage
    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const subject = body.subject?.trim() ?? ''
    const message = body.message?.trim() ?? ''

    if (!name || name.length > 100) {
      return NextResponse.json({ error: 'Prosimo, vnesite ime in priimek.' }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Prosimo, vnesite veljaven e-poštni naslov.' },
        { status: 400 }
      )
    }
    if (!subject || subject.length > 200) {
      return NextResponse.json({ error: 'Prosimo, izberite zadevo.' }, { status: 400 })
    }
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: 'Sporočilo mora imeti vsaj 10 znakov.' }, { status: 400 })
    }

    if (!rateLimit(request, 'contact', 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Preveč sporočil. Poskusite ponovno pozneje.' },
        { status: 429 }
      )
    }

    const nowLabel = new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' })
    const safeSubject = subject.replace(/<[^>]*>/g, '')

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
