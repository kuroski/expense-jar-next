import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { User as NextAuthUser } from 'next-auth'

import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Providers from 'next-auth/providers'
import prisma from '@/lib/prisma'

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string
}

const options: NextAuthOptions = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    jwt: true,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId
      },
    }),
  ],
  database: process.env.DATABASE_URL,
}

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> | void => NextAuth(req, res, options)
