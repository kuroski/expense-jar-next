import { Subscription, Subscriptions } from '@/types/subscriptions'
import { fold, mapLeft } from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'
import { failure } from 'io-ts/lib/PathReporter'

export class DecodeError extends Error {
  name = 'DecodeError'
}

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

export const getSubscriptions = (db: Db, userId: string) => {
  return db
    .collection('subscriptions')
    .find({
      createdBy: userId,
    })
    .toArray()
    .then((result) => {
      console.log(result)
      return result
    })
    .then(
      flow(
        Subscriptions.decode,
        mapLeft((errors) => new Error(failure(errors).join('\n'))),
      ),
    )
    .then((result) => {
      console.log(result)
      return fold(
        // eslint-disable-next-line promise/no-promise-in-callback
        (error) => Promise.reject(error),
        (data) => Promise.resolve(data),
      )(result)
    })
}
