import jwt from 'next-auth/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextHandler } from 'next-connect'

export default async (req: NextApiRequest, res: NextApiResponse, next: NextHandler): Promise<void> => {
  const token = await jwt.getToken({ req, secret: process.env.JWT_SECRET })

  if (token) {
    // Signed in
    req.user = token
    next()
  } else {
    // Not Signed in
    res.status(401)
    res.end()
  }
}
