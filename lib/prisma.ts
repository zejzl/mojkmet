import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  // Use PrismaNeon directly with connection string (HTTP mode)
  // Works on Vercel serverless, Edge, and local Node.js without ws package
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  })

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
