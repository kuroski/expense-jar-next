import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toDecodingError, toMissingParam, toRequestError, toUnauthorizedError } from '@/lib/errors'
import type { NextApiRequest, NextApiResponse } from 'next'
import { flow, pipe } from 'fp-ts/lib/function'
import { getAllByListSlug, saveSubscription } from '@/lib/subscription/db'

import type { Session } from 'next-auth'
import { SubscriptionFormValues } from '@/lib/subscription/codable'
import { getSession } from 'next-auth/client'
import middleware from '@/middleware'
import nc from 'next-connect'
import onError from '@/middleware/error'

const getParam = flow(
  (param: string | string[]) => (Array.isArray(param) ? param[0] : param),
  (param) => (!param || param.length === 0 ? E.left('param is not being provided') : E.right(param)),
  E.mapLeft<string, ApiError>(toMissingParam),
)

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)

handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(session.user.email) : TE.left(toUnauthorizedError))),
    TE.chain((email) =>
      pipe(
        getParam(req.query.id),
        TE.fromEither,
        TE.chain((listSlug) => getAllByListSlug(email, listSlug)),
        TE.mapLeft<unknown, ApiError>(toRequestError),
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
          case 'NOT_FOUND':
            throw error.error
        }

        return T.never
      },
      (subscriptions) => {
        res.send(subscriptions)
        res.end()
        return T.of(subscriptions)
      },
    ),
  )(),
)

handler.post(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(String(session.user.email)) : TE.left(toUnauthorizedError))),
    TE.chain(() => pipe(getParam(req.query.id), TE.fromEither)),
    TE.chain<ApiError, string, [string, SubscriptionFormValues]>((listId) =>
      pipe(
        req.body,
        SubscriptionFormValues.decode,
        E.mapLeft(toDecodingError),
        E.map<SubscriptionFormValues, [string, SubscriptionFormValues]>((subscription) => [listId, subscription]),
        TE.fromEither,
      ),
    ),
    TE.chain(([listId, values]) => saveSubscription(listId, values)),
    TE.fold(
      (error) => {
        switch (error._tag) {
          case 'UNAUTHORIZED':
            res.status(401).send('Unauthorized!')
            res.end()
            break

          case 'DECODING_ERROR':
          case 'REQUEST_ERROR':
          case 'MISSING_PARAM':
          case 'NOT_FOUND':
            throw error.error
        }

        return T.never
      },
      (subscription) => {
        res.send(subscription)
        res.end()
        return T.of(subscription)
      },
    ),
  )(),
)

export default handler
