import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { farmSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const farm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
    })

    return NextResponse.json({ farm })
  } catch (error) {
    console.error('Farm GET error:', error)
    return NextResponse.json({ error: getErrorMessage(error, 'Napaka') }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Samo kmetje lahko urejajo kmetijo' }, { status: 403 })
    }

    const parsed = await parseJson(farmSchema, request)
    if (!parsed.ok) return parsed.error

    const { name, description, address, city, postalCode, phone, website } = parsed.data

    const existingFarm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
    })

    let farm
    if (existingFarm) {
      farm = await prisma.farm.update({
        where: { userId: session!.user!.id },
        data: {
          name,
          description: description || null,
          address,
          city,
          postalCode,
          phone: phone || null,
          website: website || null,
        },
      })
    } else {
      farm = await prisma.farm.create({
        data: {
          userId: session!.user!.id,
          name,
          description: description || null,
          address,
          city,
          postalCode,
          phone: phone || null,
          website: website || null,
        },
      })
    }

    return NextResponse.json({ farm })
  } catch (error) {
    console.error('Farm PUT error:', error)
    return NextResponse.json({ error: getErrorMessage(error, 'Napaka pri shranjevanju') }, { status: 500 })
  }
}
