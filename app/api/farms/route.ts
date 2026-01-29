import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET() {
  try {
    // Check if database URL is configured
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set POSTGRES_URL environment variable.' },
        { status: 500 }
      );
    }

    const { rows } = await sql`
      SELECT 
        id,
        name,
        slug,
        description,
        city,
        rating,
        total_reviews,
        is_verified,
        is_active
      FROM farms
      WHERE is_active = true AND is_verified = true
      ORDER BY rating DESC, total_reviews DESC
    `;
    
    return NextResponse.json({ farms: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch farms',
        details: error instanceof Error ? error.message : 'Unknown error',
        env_check: !!process.env.POSTGRES_URL
      },
      { status: 500 }
    );
  }
}
