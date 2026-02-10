import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const user = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: error.message || 'Napaka' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const body = await request.json()
    const { name, email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email je obvezen' }, { status: 400 })
    }

    // Check if email is taken by another user
    if (email !== session!.user!.email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: 'Ta email je ze v uporabi' }, { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id: session!.user!.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri posodabljanju profila' }, { status: 500 })
  }
}
