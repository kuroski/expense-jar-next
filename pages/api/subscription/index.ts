import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { Subscription } from '@/framework/subscriptions/types'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) => {
  const session = await getSession({ req })
  if (!session || !session.user || !session.user.id) {
    res.status(401)
  } else {
    const subscriptions = await subscription.getSubscriptions(req.db, session.user.id)
    res.send({ subscriptions })
  }

  res.end()
})
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

  const newSubscription = await subscription.createSubscription(req.db, { data, user: req.user.id })
  res.send({ data: newSubscription })
})

export default handler
