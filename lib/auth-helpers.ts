import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

export async function getSessionOrError() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: 'Niste prijavljeni' }, { status: 401 }) }
  }
  return { session, error: null }
}
