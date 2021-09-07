import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toMissingParam } from '@/lib/errors'
import { flow, pipe } from 'fp-ts/lib/function'

import { NextApiResponse } from 'next'

export const foldResponse = <A>(res: NextApiResponse): ((ma: TE.TaskEither<ApiError, A>) => T.Task<A>) =>
  pipe(
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
      (entity) => {
        res.send(entity)
        res.end()
        return T.of(entity)
      },
    ),
  )

export const getParam = flow(
  (param: string | string[]) => (Array.isArray(param) ? param[0] : param),
  (param) => (!param || param.length === 0 ? E.left('param is not being provided') : E.right(param)),
  E.mapLeft<string, ApiError>(toMissingParam),
)

export const getParams = (...args: Array<string | string[]>) => pipe(args.map(getParam), E.sequenceArray)
