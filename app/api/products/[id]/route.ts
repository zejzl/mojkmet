import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { id: productId } = await params

    // Fetch product with farm and category info
    const products = await sql`
      SELECT 
        p.id, p.name, p.description, p.price, p.unit, p.stock, p.available, p.image,
        p."farmId", p."categoryId",
        f.name as farm_name, f.city as farm_city, f.description as farm_description, 
        f.verified as farm_verified, f.id as farm_id,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon,
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as farm_rating,
        COUNT(r.id)::integer as farm_total_reviews
      FROM products p
      JOIN farms f ON p."farmId" = f.id
      JOIN categories c ON p."categoryId" = c.id
      LEFT JOIN reviews r ON f.id = r."farmId"
      WHERE p.id = ${productId}
      GROUP BY p.id, p.name, p.description, p.price, p.unit, p.stock, p.available, p.image,
        p."farmId", p."categoryId", f.name, f.city, f.description, f.verified, f.id,
        c.name, c.slug, c.icon
    `

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = products[0]

    // Fetch related products from the same category
    const relatedProducts = await sql`
      SELECT p.id, p.name, p.price, p.unit, p.image, c.icon as category_icon
      FROM products p
      JOIN categories c ON p."categoryId" = c.id
      WHERE p."categoryId" = ${product.categoryId} AND p.id != ${productId} AND p.available = true
      LIMIT 4
    `

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
