import { Db } from 'mongodb'
import { nanoid } from 'nanoid'

export const createSubscription = async (db: Db, subscription: { createdBy: string; name: string }) => {
  return db
    .collection('subscriptions')
    .insertOne({
      _id: nanoid(12),
      ...subscription,
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])
}

export const getSubscriptions = async (db: Db, userId: string) => {
  return db
    .collection('subscriptions')
    .find({
      createdBy: userId,
    })
    .toArray()
}
