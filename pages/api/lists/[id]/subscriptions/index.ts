import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toMissingParam, toRequestError, toUnauthorizedError } from '@/lib/errors'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Session } from 'next-auth'
import { getAllByListSlug } from '@/lib/subscription/db'
import { getSession } from 'next-auth/client'
import middleware from '@/middleware'
import nc from 'next-connect'
import onError from '@/middleware/error'
import { pipe } from 'fp-ts/lib/function'

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
        req.query.id,
        (id) => (Array.isArray(id) ? id[0] : id),
        (id) => (!id || id.length === 0 ? E.left('List ID is not being provided') : E.right(id)),
        E.mapLeft<string, ApiError>(toMissingParam),
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

export default handler
