import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Points Prisma CLI at the dedicated test database (TEST_DATABASE_URL in .env.test), never
// at DATABASE_URL — used to keep the test DB's schema in sync via `prisma migrate deploy`.
config({ path: '.env.test', override: true })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['TEST_DATABASE_URL'],
  },
})
