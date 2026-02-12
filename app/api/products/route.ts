import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let products
    if (category) {
      products = await sql`
        SELECT 
          p.id, p.name, p.description, p.price, p.unit, p.stock, p.available, p.image,
          f.name as farm_name, f.city as farm_city, f.verified as farm_verified,
          c.name as category_name, c.slug as category_slug, c.icon as category_icon
        FROM products p
        JOIN farms f ON p."farmId" = f.id
        JOIN categories c ON p."categoryId" = c.id
        WHERE c.slug = ${category}
        ORDER BY p.name ASC
      `
    } else if (search) {
      const pattern = `%${search}%`
      products = await sql`
        SELECT 
          p.id, p.name, p.description, p.price, p.unit, p.stock, p.available, p.image,
          f.name as farm_name, f.city as farm_city, f.verified as farm_verified,
          c.name as category_name, c.slug as category_slug, c.icon as category_icon
        FROM products p
        JOIN farms f ON p."farmId" = f.id
        JOIN categories c ON p."categoryId" = c.id
        WHERE LOWER(p.name) LIKE LOWER(${pattern}) OR LOWER(p.description) LIKE LOWER(${pattern})
        ORDER BY p.name ASC
      `
    } else {
      products = await sql`
        SELECT 
          p.id, p.name, p.description, p.price, p.unit, p.stock, p.available, p.image,
          f.name as farm_name, f.city as farm_city, f.verified as farm_verified,
          c.name as category_name, c.slug as category_slug, c.icon as category_icon
        FROM products p
        JOIN farms f ON p."farmId" = f.id
        JOIN categories c ON p."categoryId" = c.id
        ORDER BY c.name ASC, p.name ASC
      `
    }

    // Also fetch categories with product counts
    const categories = await sql`
      SELECT c.id, c.name, c.slug, c.icon, COUNT(p.id)::integer as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p."categoryId"
      GROUP BY c.id, c.name, c.slug, c.icon
      HAVING COUNT(p.id) > 0
      ORDER BY c.name ASC
    `

    return NextResponse.json({ products, categories, total: products.length })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
