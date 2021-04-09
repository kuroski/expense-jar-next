import { ApiError, toDecodingError, toRequestError } from '@/framework/errors'
import { List } from '@/framework/lists/types'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { Errors } from 'io-ts'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'

export const createList = (db: Db) => ({ user }: { user: string }): TE.TaskEither<ApiError, List> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('lists').insertOne({
          createdBy: user,
          createdAt: new Date().toDateString(),
        }),
      toRequestError,
    ),
    TE.chain(({ result, ops }) =>
      result.ok ? TE.right(ops[0]) : TE.left(toRequestError(`Failed to insert list for user ${user}`)),
    ),
    TE.chain(flow(List.decode, E.mapLeft<Errors, ApiError>(toDecodingError), TE.fromEither)),
  )

export const getList = (db: Db) => (userId: string): TE.TaskEither<ApiError, List> =>
  pipe(
    TE.tryCatch<ApiError, unknown | null>(
      () =>
        db.collection('lists').findOne({
          createdBy: userId,
        }),
      toRequestError,
    ),
    TE.chain<ApiError, unknown | null, List>(
      flow(
        O.fromNullable,
        E.fromOption(() => toRequestError('No list found')),
        E.chain(flow(List.decode, E.mapLeft<Errors, ApiError>(toDecodingError))),
        TE.fromEither,
      ),
    ),
  )

export const shareList = (db: Db) => (user: string): TE.TaskEither<ApiError, List> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('lists').findOneAndUpdate(
          { createdBy: user },
          {
            $set: {
              updatedAt: new Date().toDateString(),
              urlId: nanoid(12),
            },
          },
        ),
      toRequestError,
    ),
    TE.chain(({ value, ok }) =>
      ok && value ? TE.right(value) : TE.left(toRequestError(`Failed to create a shared id for user ${user}`)),
    ),
    TE.chain(flow(List.decode, E.mapLeft<Errors, ApiError>(toDecodingError), TE.fromEither)),
  )
