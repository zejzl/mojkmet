import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { waitlistSchema, parseJson } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJson(waitlistSchema, request)
    if (!parsed.ok) return parsed.error

    const { email } = parsed.data

    const now = new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' })

    // 1. Notify info@mojkmet.eu about new signup
    try {
      await sendMail({
        to: 'info@mojkmet.eu',
        subject: `Nova prijava na seznam čakanja: ${email}`,
        text: `Nova prijava na seznam čakanja:\n\nE-naslov: ${email}\nDatum: ${now}\n\n---\nmojkmet.eu waitlist`,
      })
    } catch (err) {
      console.error('Failed to send notification email:', err)
      // Don't fail the signup if notification fails
    }

    // 2. Send welcome email to the subscriber
    try {
      await sendMail({
        to: email,
        subject: 'Dobrodošli na mojkmet.eu!',
        text: `Pozdravljeni!\n\nHvala, da ste se prijavili na seznam čakanja za mojkmet.eu - slovensko tržnico za sveže, lokalne pridelke.\n\nObvestili vas bomo, ko bo platforma pripravljena za uporabo.\n\nLep pozdrav,\nEkipa mojkmet.eu\nhttps://mojkmet.eu`,
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16a34a;">Dobrodošli na mojkmet.eu!</h2>
  <p>Pozdravljeni!</p>
  <p>Hvala, da ste se prijavili na seznam čakanja za <strong>mojkmet.eu</strong> - slovensko tržnico za sveže, lokalne pridelke.</p>
  <p>Obvestili vas bomo, ko bo platforma pripravljena za uporabo.</p>
  <br>
  <p>Lep pozdrav,<br>Ekipa mojkmet.eu</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  <p style="color: #9ca3af; font-size: 12px;"><a href="https://mojkmet.eu">mojkmet.eu</a> - Sveže iz kmetije, naravnost k vam.</p>
</div>`,
      })
    } catch (err) {
      console.error('Failed to send welcome email:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'Uspešno ste se prijavili na seznam čakanja!',
    })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Prislo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
