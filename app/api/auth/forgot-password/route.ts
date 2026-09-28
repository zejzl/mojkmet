import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { forgotPasswordSchema, parseJson, escapeHtml } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(request, 'forgot-password', 5, 15 * 60 * 1000)) {
      return tooManyRequests()
    }

    const parsed = await parseJson(forgotPasswordSchema, request)
    if (!parsed.ok) return parsed.error

    const normalizedEmail = parsed.data.email
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
      const expires = new Date(Date.now() + 60 * 60 * 1000)

      await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } })
      await prisma.verificationToken.create({
        data: { identifier: normalizedEmail, token: tokenHash, expires },
      })

      const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

      try {
        await sendMail({
          to: normalizedEmail,
          subject: 'Ponastavitev gesla - mojkmet.eu',
          text: `Pozdravljeni!\n\nPrejeli ste zahtevo za ponastavitev gesla na mojkmet.eu.\n\nPovezava za ponastavitev (velja 1 uro):\n${resetUrl}\n\nCe zahtev niste poslali vi, prezrite to sporocilo.\n\nLep pozdrav,\nEkipa mojkmet.eu`,
          html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #16a34a;">Ponastavitev gesla</h2>
  <p>Pozdravljeni!</p>
  <p>Prejeli ste zahtevo za ponastavitev gesla na <strong>mojkmet.eu</strong>.</p>
  <p style="margin: 24px 0;">
    <a href="${resetUrl}" style="background-color: #16a34a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Ponastavi geslo</a>
  </p>
  <p style="color: #6b7280; font-size: 14px;">Povezava velja <strong>1 uro</strong>. Ce gumb ne dela, kopirajte naslov v brskalnik:<br><span style="word-break: break-all;">${escapeHtml(resetUrl)}</span></p>
  <p>Ce zahtev niste poslali vi, prezrite to sporocilo in geslo ostane nespremenjeno.</p>
  <br>
  <p>Lep pozdrav,<br>Ekipa mojkmet.eu</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  <p style="color: #9ca3af; font-size: 12px;"><a href="https://mojkmet.eu">mojkmet.eu</a> - Sveže iz kmetije, naravnost k vam.</p>
</div>`,
        })
      } catch (err) {
        console.error('Failed to send password reset email:', err)
        return NextResponse.json(
          { error: 'Prislo je do napake pri posiljanju e-poste. Poskusite ponovno.' },
          { status: 500 }
        )
      }
    }

    // Generic response - do not reveal whether the account exists
    return NextResponse.json({
      success: true,
      message:
        'Ce racun obstaja, je povezava za ponastavitev gesla poslana na vas e-poštni naslov.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Prislo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
