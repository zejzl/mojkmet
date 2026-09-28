import dotenv from 'dotenv'
import path from 'path'

// Loaded as the very first import of every integration test file, before any app code
// (route handlers, `@/lib/prisma`) is imported — `@/lib/prisma` reads DATABASE_URL at
// module-load time, so it must already point at the test DB by the time that happens.
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') })

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL

if (!TEST_DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL is not set. Integration tests refuse to run without an explicit, ' +
      'dedicated test database (see .env.test / README) — this never falls back to DATABASE_URL.'
  )
}

if (TEST_DATABASE_URL === process.env.DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL must not equal DATABASE_URL — refusing to run integration tests ' +
      'against what might be the production database.'
  )
}

process.env.DATABASE_URL = TEST_DATABASE_URL
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'test-only-secret'
