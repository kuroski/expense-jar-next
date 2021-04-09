import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Session } from 'next-auth'
import nc from 'next-connect'
import * as db from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { ApiError, toRequestError, toUnauthorizedError } from '@/framework/errors'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)
handler.post(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain(db.list.shareList(req.db)),
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
      (list) => {
        res.send({ list })
        res.end()
        return T.of(list)
      },
    ),
  )(),
)

export default handler
