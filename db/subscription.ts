import { Subscription, Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'
import { Db } from 'mongodb'

export const createSubscription = async (db: Db, { data, user }: { data: Subscription; user: string }) => {
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
