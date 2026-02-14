import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL environment variable.' },
        { status: 500 }
      );
    }

    const { id: farmId } = await params;

    // Fetch farm details with rating
    const farmRows = await sql`
      SELECT 
        f.id,
        f.name,
        f.description,
        f.city,
        f.verified as is_verified,
        f."createdAt",
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating,
        COUNT(r.id)::integer as total_reviews
      FROM farms f
      LEFT JOIN reviews r ON f.id = r."farmId"
      WHERE f.id = ${farmId}
      GROUP BY f.id, f.name, f.description, f.city, f.verified, f."createdAt"
    `;

    if (farmRows.length === 0) {
      return NextResponse.json(
        { error: 'Farm not found' },
        { status: 404 }
      );
    }

    const farm = farmRows[0];

    // Fetch farm products
    const productRows = await sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.unit,
        p.category,
        p.available
      FROM products p
      WHERE p."farmId" = ${farmId}
      ORDER BY p.available DESC, p.name ASC
    `;

    return NextResponse.json({ 
      farm,
      products: productRows
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch farm details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
