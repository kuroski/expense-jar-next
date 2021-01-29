import { Db, MongoClient } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'

export interface Subscription {
  name: string
}

export interface UserSession {
  id: string
  image: string
  email: string
  name: string
}

export interface Request extends NextApiRequest {
  db: Db
  dbClient: MongoClient
  user: { email: string; id: string }
}
