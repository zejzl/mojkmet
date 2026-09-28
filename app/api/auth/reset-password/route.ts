import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { resetPasswordSchema, parseJson } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    if (!(await rateLimit(request, 'reset-password', 10, 15 * 60 * 1000))) {
      return tooManyRequests()
    }

    const parsed = await parseJson(resetPasswordSchema, request)
    if (!parsed.ok) return parsed.error

    const { email, token, password } = parsed.data
    const normalizedEmail = email
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: normalizedEmail, token: tokenHash } },
    })

    if (!record) {
      return NextResponse.json(
        { error: 'Neveljavna ali ze uporabljena povezava. Zahtejte novo.' },
        { status: 400 }
      )
    }

    if (record.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier: normalizedEmail, token: tokenHash } },
      })
      return NextResponse.json(
        { error: 'Povezava je potekla. Zahtejte novo ponastavitev gesla.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (!user) {
      return NextResponse.json({ error: 'Racun ne obstaja' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { email: normalizedEmail },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Geslo je bilo uspesno spremenjeno. Zdaj se lahko prijavite.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Prislo je do napake. Prosimo, poskusite ponovno.' },
      { status: 500 }
    )
  }
}
