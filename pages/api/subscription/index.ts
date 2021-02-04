import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.post(async (req, res) => {
  if (!req.user.id) {
    console.error('No user provided')
    throw new Error(`No user provided to add the subscriptions ${req.body.name}`)
  }
  const newFolder = await subscription.createSubscription(req.db, { createdBy: req.user.id, name: req.body.name })
  res.send({ data: newFolder })
})

export default handler
