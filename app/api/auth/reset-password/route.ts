import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, max = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  entry.count++
  return entry.count <= max
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Prevec zahtevkov. Poskusite ponovno pozneje.' },
        { status: 429 }
      )
    }

    const { email, token, password } = await request.json()

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'Manjkajo podatki za ponastavitev' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Geslo mora biti dolgo vsaj 8 znakov' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex')

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
      return NextResponse.json(
        { error: 'Racun ne obstaja' },
        { status: 400 }
      )
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
