import { prisma } from '@/lib/prisma'
import { imageResponse } from '@/lib/image-response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const farm = await prisma.farm.findUnique({ where: { id }, select: { image: true } })
  return imageResponse(farm?.image, request.url)
}
