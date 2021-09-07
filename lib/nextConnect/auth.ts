import type { NextApiRequest, NextApiResponse } from 'next'

import type { NextHandler } from 'next-connect'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse, next: NextHandler): Promise<void> => {
  const session = await getSession({ req })

  if (session && session?.user?.email) {
    req.user = {
      email: session.user.email,
    }
    next()
  } else {
    res.status(401)
    res.end()
  }
}
