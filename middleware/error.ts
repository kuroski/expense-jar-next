import type { NextApiRequest, NextApiResponse } from 'next'

export default async function onError(error: unknown, _req: NextApiRequest, res: NextApiResponse) {
  console.error(error)
  res.status(500).send(error)
  res.end()
}
