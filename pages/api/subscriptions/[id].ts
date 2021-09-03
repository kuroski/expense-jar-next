import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toMissingParam, toRequestError, toUnauthorizedError } from '@/lib/errors'
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteSubscription, getSubscription } from '@/lib/subscription/db'
import { flow, pipe } from 'fp-ts/lib/function'

import type { Session } from 'next-auth'
import { getSession } from 'next-auth/client'
import middleware from '@/middleware'
import nc from 'next-connect'
import onError from '@/middleware/error'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)

const getParam = flow(
  (param: string | string[]) => (Array.isArray(param) ? param[0] : param),
  (param) => (!param || param.length === 0 ? E.left('param is not being provided') : E.right(param)),
  E.mapLeft<string, ApiError>(toMissingParam),
)

const getParams = (...args: Array<string | string[]>) => pipe(args.map(getParam), E.sequenceArray, TE.fromEither)

handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(session.user.email) : TE.left(toUnauthorizedError))),
    TE.chain(() =>
      pipe(
        getParams(req.query.id),
        TE.chain(([id]) => getSubscription(id)),
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
      (subscription) => {
        res.send(subscription)
        res.end()
        return T.of(subscription)
      },
    ),
  )(),
)
handler.delete(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(session.user.email) : TE.left(toUnauthorizedError))),
    TE.chain((email) =>
      pipe(
        getParams(req.query.id, req.query.subscriptionId),
        TE.chain(([listId, id]) => deleteSubscription(email, listId, id)),
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
      (subscription) => {
        res.send(subscription)
        res.end()
        return T.of(subscription)
      },
    ),
  )(),
)

export default handler
