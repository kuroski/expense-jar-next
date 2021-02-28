import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Session } from 'next-auth/client'
import nc from 'next-connect'
import { subscription } from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { Subscription } from '@/framework/subscriptions/types'
import { FormValues } from '@/pages/subscriptions/new'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { failure } from 'io-ts/lib/PathReporter'
import { nanoid } from 'nanoid'
import * as These from 'fp-ts/lib/These'
import { ApiError, toRequestError, toUnauthorizedError } from '@/framework/errors'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(session.user.id) : TE.left(toUnauthorizedError))),
    TE.chain(flow(subscription.getSubscriptions(req.db), TE.mapLeft<unknown, ApiError>(toRequestError))),
    TE.fold(
      (error: ApiError) => {
        switch (error._tag) {
          case 'UNAUTHORIZED':
            res.status(401).send("Unauthorized!")
            res.end()
            break

          case 'REQUEST_ERROR':
            throw error.error
        }

        return T.never
      },
      (subscriptions) => {
        res.send({ subscriptions })
        res.end()
        return T.of(subscriptions)
      },
    ),
  )(),
)
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
