import { ApiError, toDecodingError, toRequestError } from '@/framework/errors'
import { Subscription, Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { Errors } from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter'
import { Db } from 'mongodb'

export const createSubscription = (db: Db) => ({
  data,
  user,
}: {
  data: Subscription
  user: string
}): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('subscriptions').insertOne({
          ...Subscription.encode(data),
          createdBy: user,
          createdAt: new Date().toDateString(),
        }),
      toRequestError,
    ),
    TE.chain(({ result, ops }) =>
      result.ok ? TE.right(ops[0]) : TE.left(toRequestError(`Failed to insert subscription ${data.name}`)),
    ),
    TE.chain(flow(Subscription.decode, E.mapLeft<Errors, ApiError>(toDecodingError), TE.fromEither)),
  )

export const updateSubscription = (db: Db) => ({
  data,
  user,
}: {
  data: Subscription
  user: string
}): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('subscriptions').findOneAndUpdate(
          {
            _id: data._id,
            createdBy: user,
          },
          {
            $set: {
              ...Subscription.encode(data),
              updatedAt: new Date().toDateString(),
            },
          },
        ),
      toRequestError,
    ),
    (a) => a,
    TE.chain(({ ok, value }) =>
      ok ? TE.right(value) : TE.left(toRequestError(`Failed to insert subscription ${data.name}`)),
    ),
    TE.chain(flow(Subscription.decode, E.mapLeft<Errors, ApiError>(toDecodingError), TE.fromEither)),
  )

export const getSubscriptions = (db: Db) => (userId: string): TE.TaskEither<Error, Subscriptions> =>
  pipe(
    TE.tryCatch(
      () =>
        db
          .collection('subscriptions')
          .find({
            createdBy: userId,
          })
          .toArray(),
      E.toError,
    ),
    TE.chain(
      flow(
        Subscriptions.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )

export const getSubscription = (db: Db) => (
  userId: string,
  subscriptionId: string,
): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch<ApiError, unknown | null>(
      () =>
        db.collection('subscriptions').findOne({
          createdBy: userId,
          _id: subscriptionId,
        }),
      toRequestError,
    ),
    TE.chain<ApiError, unknown | null, Subscription>(
      flow(
        O.fromNullable,
        E.fromOption(() => toRequestError('No subscription found')),
        E.chain(flow(Subscription.decode, E.mapLeft<Errors, ApiError>(toDecodingError))),
        TE.fromEither,
      ),
    ),
  )

export const deleteSubscription = (db: Db) => (
  userId: string,
  subscriptionId: string,
): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('subscriptions').findOneAndDelete({
          createdBy: userId,
          _id: subscriptionId,
        }),
      toRequestError,
    ),
    TE.chain((result) => (result.ok ? TE.right(result.value) : TE.left(toRequestError(result.lastErrorObject)))),
    TE.chain(flow(Subscription.decode, E.mapLeft<Errors, ApiError>(toDecodingError), TE.fromEither)),
  )
