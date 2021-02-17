import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { Subscription } from '@/framework/subscriptions/types'
import { FormValues } from '@/pages/subscriptions/new'
import { flow } from 'fp-ts/lib/function'
import { mapLeft } from 'fp-ts/lib/Either'
import { failure } from 'io-ts/lib/PathReporter'
import { nanoid } from 'nanoid'
import { isLeft } from 'fp-ts/lib/These'

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

  const body: FormValues = req.body as FormValues

  const data = flow(
    Subscription.decode,
    mapLeft((errors) => new Error(failure(errors).join('\n'))),
  )({
    _id: nanoid(12),
    color: body.color,
    cycleAmount: body.cycleAmount,
    cyclePeriod: body.cyclePeriod,
    firstBill: body.firstBill,
    icon: body.icon,
    name: body.name,
    price: body.price,
    overview: body.overview,
  })

  if (isLeft(data)) {
    throw data.left
  }

  const newSubscription = await subscription.createSubscription(req.db, {
    data: data.right,
    user: req.user.id,
  })
  res.send({ data: newSubscription })
})

export default handler
