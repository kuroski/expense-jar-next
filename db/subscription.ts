import type { Subscription } from '@/services/subscriptions'
import { decoder } from '@/services/subscriptions'
import { Db } from 'mongodb'
import { nanoid } from 'nanoid'

export const createSubscription = async (db: Db, subscription: Subscription & { createdBy: string }) => {
  return db
    .collection('subscriptions')
    .insertOne({
      ...subscription,
      _id: nanoid(12),
      createdAt: new Date().toDateString(),
    })
    .then(({ ops }) => ops[0])
}

export const getSubscriptions = async (db: Db, userId: string): Promise<Subscription[]> => {
  return db
    .collection('subscriptions')
    .find({
      createdBy: userId,
    })
    .toArray()
    .then(decoder)
}
