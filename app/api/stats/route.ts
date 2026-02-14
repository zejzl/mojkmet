import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL environment variable.' },
        { status: 500 }
      );
    }

    const rows = await sql`
      SELECT 
        (SELECT COUNT(*) FROM farms)::integer as farm_count,
        (SELECT COUNT(*) FROM products)::integer as product_count,
        (SELECT COUNT(*) FROM orders)::integer as order_count
    `;
    
    const stats = rows[0];
    
    return NextResponse.json({ 
      farmCount: stats.farm_count,
      productCount: stats.product_count,
      orderCount: stats.order_count
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
