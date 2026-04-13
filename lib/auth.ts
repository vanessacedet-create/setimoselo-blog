import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null

        const adminPassword = process.env.ADMIN_PASSWORD || 'setimoselo@admin'

        // Suporta senha em plain text ou hash bcrypt
        let valid = false
        if (adminPassword.startsWith('$2')) {
          valid = await bcrypt.compare(credentials.password, adminPassword)
        } else {
          valid = credentials.password === adminPassword
        }

        if (valid) {
          return { id: '1', name: 'Admin', email: 'admin@setimoselo.com.br' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'setimoselo-blog-secret-change-me',
}
