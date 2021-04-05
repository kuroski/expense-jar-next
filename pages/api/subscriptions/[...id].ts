import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Session } from 'next-auth'
import nc from 'next-connect'
import * as db from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { ApiError, toRequestError, toUnauthorizedError, toMissingParam } from '@/framework/errors'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain((userId) =>
      pipe(
        req.query.id,
        (id: string | string[]) => (Array.isArray(id) ? id[0] : id),
        (id) => (!id || id.length === 0 ? E.left('Subscription ID is not being provided') : E.right(id)),
        E.mapLeft<string, ApiError>(toMissingParam),
        TE.fromEither,
        TE.chain((subscriptionId) => db.subscription.getSubscription(req.db)(userId, subscriptionId)),
      ),
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

handler.delete(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain((userId) =>
      pipe(
        req.query.id,
        (id: string | string[]) => (Array.isArray(id) ? id[0] : id),
        (id) => (!id || id.length === 0 ? E.left('Subscription ID is not being provided') : E.right(id)),
        E.mapLeft<string, ApiError>(toMissingParam),
        TE.fromEither,
        TE.chain((subscriptionId) => db.subscription.deleteSubscription(req.db)(userId, subscriptionId)),
      ),
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
