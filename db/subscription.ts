import { Subscription, Subscriptions } from '@/framework/subscriptions/types'
import { fold, mapLeft } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { failure } from 'io-ts/lib/PathReporter'

export const createSubscription = async (db: Db, { data, user }: { data: Subscription; user: string }) => {
  return db
    .collection('subscriptions')
    .insertOne({
      ...data,
      createdBy: user,
      _id: nanoid(12),
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])
}

export const getSubscriptions = (db: Db, userId: string): Promise<Subscriptions> => {
  return db
    .collection('subscriptions')
    .find({
      createdBy: userId,
    })
    .toArray()
    .then(
      flow(
        Subscriptions.decode,
        mapLeft((errors) => new Error(failure(errors).join('\n'))),
        fold(
          // eslint-disable-next-line promise/no-promise-in-callback
          (errors) => Promise.reject(errors.message),
          (data) => Promise.resolve(data as Subscriptions),
        ),
      ),
    )
}
