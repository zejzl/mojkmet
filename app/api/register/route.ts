import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, tooManyRequests } from '@/lib/rate-limit'
import { registerSchema, parseJson } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    if (!rateLimit(request, 'register', 5, 15 * 60 * 1000)) {
      return tooManyRequests()
    }

    const parsed = await parseJson(registerSchema, request)
    if (!parsed.ok) return parsed.error

    const { email, password, name, role } = parsed.data
    const safeRole = role ?? 'CONSUMER'
    const safeName = name?.trim() || null

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: 'Ta email je ze v uporabi' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: safeName,
        role: safeRole,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    const prismaError = error as { message?: string; code?: string; meta?: unknown }
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: prismaError.message,
      code: prismaError.code,
      meta: prismaError.meta,
    })

    const errorMessage =
      prismaError.code === 'P2002' ? 'Ta email je ze v uporabi' : 'Napaka pri registraciji'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
