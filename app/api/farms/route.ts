import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
      { error: 'Failed to fetch farms' },
      { status: 500 }
    );
  }
}
