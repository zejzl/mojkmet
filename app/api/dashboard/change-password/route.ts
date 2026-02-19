import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Obe gesli sta obvezni' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Novo geslo mora imeti vsaj 8 znakov' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: { id: true, password: true },
    })

    if (!user?.password) {
      return NextResponse.json({ error: 'Napaka pri preverjanju gesla' }, { status: 400 })
    }

    const isCorrect = await bcrypt.compare(currentPassword, user.password)
    if (!isCorrect) {
      return NextResponse.json({ error: 'Trenutno geslo ni pravilno' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: session!.user!.id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Change password error:', err)
    return NextResponse.json({ error: err.message || 'Napaka pri spremembi gesla' }, { status: 500 })
  }
}
