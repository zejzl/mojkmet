import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    // Check if database URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL environment variable.' },
        { status: 500 }
      );
    }

    const rows = await sql`
      SELECT 
        id,
        name,
        description,
        city,
        verified,
        "createdAt"
      FROM farms
      ORDER BY "createdAt" DESC
    `;
    
    return NextResponse.json({ farms: rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch farms',
        details: error instanceof Error ? error.message : 'Unknown error',
        env_check: !!process.env.DATABASE_URL
      },
      { status: 500 }
    );
  }
}
