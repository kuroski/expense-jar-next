import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import type { Session } from 'next-auth'
import nc from 'next-connect'
import * as db from '@/db'
import middleware from '@/middleware/all'
import onError from '@/middleware/error'
import { pipe, flow } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import { ApiError, toRequestError, toUnauthorizedError, toMissingParam, toDecodingError } from '@/lib/errors'
import { FormValues, List } from '@/framework/lists/types'
import { Errors } from 'io-ts'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError,
})

handler.use(middleware)

handler.put(async (req, res) =>
  pipe(
    TE.tryCatch<ApiError, Session | null>(() => getSession({ req }), toRequestError),
    TE.chain((session) => (session?.user?.id ? TE.right(String(session.user.id)) : TE.left(toUnauthorizedError))),
    TE.chain<ApiError, string, [string, string]>((userId) =>
      pipe(
        req.query.id,
        (id: string | string[]) => (Array.isArray(id) ? id[0] : id),
        (id) => (!id || id.length === 0 ? E.left('List ID is not being provided') : E.right(id)),
        E.mapLeft<string, ApiError>(toMissingParam),
        TE.fromEither,
        TE.map((listId): [string, string] => [userId, listId]),
      ),
    ),
    TE.chain<ApiError, [string, string], [string, string, FormValues]>(([userId, listId]) =>
      pipe(
        req.body,
        FormValues.decode,
        E.mapLeft(toDecodingError),
        TE.fromEither,
        TE.map((formValues): [string, string, FormValues] => [userId, listId, formValues]),
      ),
    ),
    TE.chain<ApiError, [string, string, FormValues], [string, List]>(([userId, listId, formValues]) =>
      pipe(
        {
          _id: listId,
          currency: formValues.code,
          urlId: undefined,
        },
        E.fromPredicate(
          List.is,
          flow(
            List.decode,
            E.fold<Errors, List, ApiError>(toDecodingError, () => toRequestError('An error ocurred when saving list')),
          ),
        ),
        TE.fromEither,
        TE.map((list): [string, List] => [userId, list]),
      ),
    ),
    TE.chain(([userId, list]) => db.list.updateList(req.db)({ data: list, user: userId })),
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
