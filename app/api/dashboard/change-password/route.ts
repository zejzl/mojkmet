import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import bcrypt from 'bcryptjs'
import { changePasswordSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const parsed = await parseJson(changePasswordSchema, request)
    if (!parsed.ok) return parsed.error

    const { currentPassword, newPassword } = parsed.data

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

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session!.user!.id },
      data: { password: hashed },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri spremembi gesla') },
      { status: 500 }
    )
  }
}
