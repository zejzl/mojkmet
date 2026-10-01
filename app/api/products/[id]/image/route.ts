import { prisma } from '@/lib/prisma'
import { imageResponse } from '@/lib/image-response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, select: { image: true } })
  return imageResponse(product?.image, request.url)
}
