import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Veljaven e-poštni naslov je obvezen' },
        { status: 400 }
      )
    }

    // Send email to info@mojkmet.eu
    const emailContent = `
Nova prijava na seznam čakanja:

E-naslov: ${email}
Datum: ${new Date().toLocaleString('sl-SI')}

---
Pošiljatelj: mojkmet.eu waitlist
    `.trim()

    // For now, we'll just log it and return success
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log('Waitlist signup:', email)
    console.log('Email to send:', emailContent)

    // TODO: Send actual email to info@mojkmet.eu
    // Example with fetch (you'll need to set up email service):
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'info@mojkmet.eu' }],
          subject: `Nova prijava na seznam čakanja: ${email}`,
        }],
        from: { email: 'noreply@mojkmet.eu' },
        content: [{
          type: 'text/plain',
          value: emailContent,
        }],
      }),
    })
    */

    return NextResponse.json({ 
      success: true,
      message: 'Uspešno ste se prijavili na seznam čakanja!' 
    })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Prišlo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
