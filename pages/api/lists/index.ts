import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toDecodingError, toRequestError, toUnauthorizedError } from '@/lib/errors'
import type { NextApiRequest, NextApiResponse } from 'next'
import { flow, pipe } from 'fp-ts/lib/function'
import { getLists, saveList } from '@/lib/list/db'

import { ListFormValues } from '@/lib/list/codable'
import type { Session } from 'next-auth'
import { getSession } from 'next-auth/client'
import middleware from '@/middleware'
import nc from 'next-connect'
import onError from '@/middleware/error'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.get(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(session.user.email) : TE.left(toUnauthorizedError))),
    TE.chain(flow(getLists, TE.mapLeft<unknown, ApiError>(toRequestError))),
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
      (list) => {
        res.send(list)
        res.end()
        return T.of(list)
      },
    ),
  )(),
)

handler.post(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.email ? TE.right(String(session.user.email)) : TE.left(toUnauthorizedError))),
    TE.chain<ApiError, string, [string, ListFormValues]>((email) =>
      pipe(
        req.body,
        ListFormValues.decode,
        E.mapLeft(toDecodingError),
        TE.fromEither,
        TE.map((values) => [email, values]),
      ),
    ),
    TE.chain(([email, values]) => saveList(email, values)),
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
      (list) => {
        res.send(list)
        res.end()
        return T.of(list)
      },
    ),
  )(),
)

export default handler
