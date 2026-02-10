import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const farm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
    })

    return NextResponse.json({ farm })
  } catch (error: any) {
    console.error('Farm GET error:', error)
    return NextResponse.json({ error: error.message || 'Napaka' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Samo kmetje lahko urejajo kmetijo' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, address, city, postalCode, phone, website } = body

    if (!name || !address || !city || !postalCode) {
      return NextResponse.json({ error: 'Ime, naslov, mesto in postna stevilka so obvezni' }, { status: 400 })
    }

    const existingFarm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
    })

    let farm
    if (existingFarm) {
      farm = await prisma.farm.update({
        where: { userId: session!.user!.id },
        data: { name, description, address, city, postalCode, phone, website },
      })
    } else {
      farm = await prisma.farm.create({
        data: {
          userId: session!.user!.id,
          name,
          description,
          address,
          city,
          postalCode,
          phone,
          website,
        },
      })
    }

    return NextResponse.json({ farm })
  } catch (error: any) {
    console.error('Farm PUT error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri shranjevanju' }, { status: 500 })
  }
}
