import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, tooManyRequests } from '@/lib/rate-limit'

const VALID_ROLES = ['CONSUMER', 'FARMER']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    if (!rateLimit(request, 'register', 5, 15 * 60 * 1000)) {
      return tooManyRequests()
    }

    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Veljaven e-postni naslov je obvezen' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Geslo mora biti dolgo vsaj 8 znakov' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const safeRole = VALID_ROLES.includes(role) ? role : 'CONSUMER'
    const safeName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 100) : null

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: safeName,
        role: safeRole,
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })

    const errorMessage = error.code === 'P2002'
      ? 'Ta email je ze v uporabi'
      : 'Napaka pri registraciji'

    return NextResponse.json(
      { error: errorMessage, code: error.code || 'UNKNOWN' },
      { status: 500 }
    )
  }
}
