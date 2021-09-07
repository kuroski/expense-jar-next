import type { NextApiRequest, NextApiResponse } from 'next'

export default async function onError(error: unknown, _req: NextApiRequest, res: NextApiResponse): Promise<void> {
  console.error(error)
  res.status(500)

  if (error instanceof Error) {
    res.status(500).send(error.message)
    res.end(error.message)
  } else {
    res.end(500)
  }
}
