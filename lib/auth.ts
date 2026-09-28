import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { loginSchema } from './validation'

// Pulled out of the CredentialsProvider() call below so it's directly unit-testable —
// NextAuth wraps whatever function is passed as `authorize`, so reaching into
// `authOptions.providers[0].authorize` from a test does not get this function back.
export async function authorizeCredentials(credentials: unknown) {
  const parsed = loginSchema.safeParse(credentials)
  if (!parsed.success) {
    throw new Error('Invalid credentials')
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  // Same generic message whether the email doesn't exist or the password is wrong —
  // distinguishing them would let an attacker enumerate registered emails.
  if (!user || !user.password) {
    throw new Error('Invalid credentials')
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    throw new Error('Invalid credentials')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
