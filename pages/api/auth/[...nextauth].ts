import NextAuth, { InitOptions } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import Providers from 'next-auth/providers'
// import { connectToDB } from '../../../db'

const options: InitOptions = {
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  database: process.env.DATABASE_URL,
  callbacks: {
    async session(session, user) {
      session.user.id = user.id
      return session
    },
    async jwt(tokenPayload, user, account, profile, isNewUser) {
      // const { db } = await connectToDB()

      if (isNewUser) {
        console.log('new user, pre-create things!')
      }

      if (tokenPayload && user) {
        return { ...tokenPayload, id: `${user.id}` }
      }

      return tokenPayload
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
