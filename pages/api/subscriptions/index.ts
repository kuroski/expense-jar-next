import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Session } from 'next-auth'
import nc from 'next-connect'
import * as db from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { Subscription } from '@/framework/subscriptions/types'
import { FormValues } from '@/framework/subscriptions/types'
import { flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { nanoid } from 'nanoid'
import { ApiError, toRequestError, toUnauthorizedError, toDecodingError } from '@/framework/errors'
import { Errors } from 'io-ts'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain(flow(db.subscription.getSubscriptions(req.db), TE.mapLeft<unknown, ApiError>(toRequestError))),
    TE.fold(
      (error: ApiError) => {
        switch (error._tag) {
          case 'UNAUTHORIZED':
            res.status(401).send('Unauthorized!')
            res.end()
            break

          case 'DECODING_ERROR':
          case 'REQUEST_ERROR':
          case 'MISSING_PARAM':
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

handler.post(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain<ApiError, string, [string, FormValues]>((userId) =>
      pipe(
        req.body,
        FormValues.decode,
        E.mapLeft(toDecodingError),
        TE.fromEither,
        TE.map((formValues): [string, FormValues] => [userId, formValues]),
      ),
    ),
    TE.chain<ApiError, [string, FormValues], [string, Subscription]>(([userId, formValues]) =>
      pipe(
        {
          _id: nanoid(12),
          color: formValues.color,
          cycleAmount: formValues.cycleAmount,
          cyclePeriod: formValues.cyclePeriod,
          firstBill: formValues.firstBill,
          icon: formValues.icon,
          name: formValues.name,
          price: formValues.price,
          overview: formValues.overview,
        },
        E.fromPredicate(
          Subscription.is,
          flow(
            Subscription.decode,
            E.fold<Errors, Subscription, ApiError>(toDecodingError, () =>
              toRequestError('An error ocurred when saving subscription'),
            ),
          ),
        ),
        TE.fromEither,
        TE.map((subscription): [string, Subscription] => [userId, subscription]),
      ),
    ),
    TE.chain(([userId, subscription]) =>
      db.subscription.createSubscription(req.db)({ data: subscription, user: userId }),
    ),
    TE.fold(
      (error: ApiError) => {
        switch (error._tag) {
          case 'UNAUTHORIZED':
            res.status(401).send('Unauthorized!')
            res.end()
            break

          case 'DECODING_ERROR':
          case 'REQUEST_ERROR':
          case 'MISSING_PARAM':
            throw error.error
        }

        return T.never
      },
      (subscription) => {
        res.send({ subscription })
        res.end()
        return T.of(subscription)
      },
    ),
  )(),
)

export default handler
