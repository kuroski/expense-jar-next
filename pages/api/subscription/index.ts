import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { Subscription } from '@/framework/subscriptions/types'
import { FormValues } from '@/pages/subscriptions/new'
import { absurd, flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { failure } from 'io-ts/lib/PathReporter'
import { nanoid } from 'nanoid'
import * as These from 'fp-ts/lib/These'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) => {
  const session = await getSession({ req })
  if (!session || !session.user || !session.user.id) {
    res.status(401)
  } else {
    pipe(
      subscription.getSubscriptions(req.db, session.user.id),
      TE.fold(
        (err) => {
          console.log(err)
          throw new Error(err.message)
        },
        (subscriptions) => {
          res.send({ subscriptions })
          res.end()

          return T.of(absurd)
        },
      ),
    )()
  }
})
handler.post(async (req, res) => {
  if (!req.user.id) {
    console.error('No user provided')
    throw new Error(`No user provided to add the subscriptions ${req.body.name}`)
  }

  const body: FormValues = req.body as FormValues

  const data = flow(
    Subscription.decode,
    E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
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

  if (These.isLeft(data)) {
    throw new Error(data.left.message)
  }

  const newSubscription = await subscription.createSubscription(req.db, {
    data: data.right,
    user: req.user.id,
  })
  res.send({ data: newSubscription })
})

export default handler
