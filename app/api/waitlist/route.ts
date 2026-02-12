import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MOJKMET_EMAIL_SERVER || 'mail.mojkmet.eu',
  port: parseInt(process.env.MOJKMET_SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.MOJKMET_EMAIL_USER || 'info@mojkmet.eu',
    pass: process.env.MOJKMET_EMAIL_PASS || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Veljaven e-postni naslov je obvezen' },
        { status: 400 }
      )
    }

    const now = new Date().toLocaleString('sl-SI', { timeZone: 'Europe/Ljubljana' })

    // 1. Notify info@mojkmet.eu about new signup
    try {
      await transporter.sendMail({
        from: '"mojkmet.eu" <info@mojkmet.eu>',
        to: 'info@mojkmet.eu',
        subject: `Nova prijava na seznam cakanja: ${email}`,
        text: `Nova prijava na seznam cakanja:\n\nE-naslov: ${email}\nDatum: ${now}\n\n---\nmojkmet.eu waitlist`,
      })
    } catch (err) {
      console.error('Failed to send notification email:', err)
      // Don't fail the signup if notification fails
    }

    // 2. Send welcome email to the subscriber
    try {
      await transporter.sendMail({
        from: '"mojkmet.eu" <info@mojkmet.eu>',
        to: email,
        subject: 'Dobrodosli na mojkmet.eu!',
        text: `Pozdravljeni!\n\nHvala, da ste se prijavili na seznam cakanja za mojkmet.eu - slovensko trznico za sveze, lokalne pridelke.\n\nObvestili vas bomo, ko bo platforma pripravljena za uporabo.\n\nLep pozdrav,\nEkipa mojkmet.eu\nhttps://mojkmet.eu`,
        html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16a34a;">Dobrodosli na mojkmet.eu!</h2>
  <p>Pozdravljeni!</p>
  <p>Hvala, da ste se prijavili na seznam cakanja za <strong>mojkmet.eu</strong> - slovensko trznico za sveze, lokalne pridelke.</p>
  <p>Obvestili vas bomo, ko bo platforma pripravljena za uporabo.</p>
  <br>
  <p>Lep pozdrav,<br>Ekipa mojkmet.eu</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  <p style="color: #9ca3af; font-size: 12px;"><a href="https://mojkmet.eu">mojkmet.eu</a> - Sveze iz kmetije, naravnost k vam.</p>
</div>`,
      })
    } catch (err) {
      console.error('Failed to send welcome email:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'Uspesno ste se prijavili na seznam cakanja!'
    })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Prislo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
