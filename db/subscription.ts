import { Subscription, Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'
import { Db } from 'mongodb'

export const createSubscription = async (
  db: Db,
  { data, user }: { data: Subscription; user: string },
): Promise<Subscription> => {
  return db
    .collection('subscriptions')
    .insertOne({
      ...Subscription.encode(data),
      createdBy: user,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])
}

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
): TE.TaskEither<Error, Subscription> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('subscriptions').findOne({
          createdBy: userId,
          id: subscriptionId,
        }),
      E.toError,
    ),
    TE.chain(
      flow(
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )

export const deleteSubscription = (db: Db) => (
  userId: string,
  subscriptionId: string,
): TE.TaskEither<Error, Subscription> =>
  pipe(
    TE.tryCatch(
      () =>
        db.collection('subscriptions').findOneAndDelete({
          createdBy: userId,
          _id: subscriptionId,
        }),
      E.toError,
    ),
    TE.mapLeft((a) => {
      console.log(a)
      return a
    }),
    TE.chain(
      flow(
        (a) => {
          console.log(a)
          return a.value
        },
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
