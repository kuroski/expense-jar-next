import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import type { Subscription } from '@/types'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.post(async (req, res) => {
  if (!req.user.id) {
    console.error('No user provided')
    throw new Error(`No user provided to add the subscriptions ${req.body.name}`)
  }

  const data: Subscription = {
    _id: '',
    color: req.body.color,
    cycleAmount: req.body.cycleAmount,
    cyclePeriod: req.body.cyclePeriod,
    firstBill: req.body.firstBill,
    icon: req.body.icon,
    name: req.body.name,
    price: req.body.price,
    overview: req.body.overview,
  }

  const newFolder = await subscription.createSubscription(req.db, { createdBy: req.user.id, ...data })
  res.send({ data: newFolder })
})

export default handler
