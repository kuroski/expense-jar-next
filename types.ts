import { Db, MongoClient } from 'mongodb'
import { NextApiRequest } from 'next'
import 'next-auth'

export interface Subscription {
  id: string
  name: string
}

export interface UserSession {
  id: string
  image?: string
  email?: string
  name?: string
}

export interface Request extends NextApiRequest {
  db: Db
  dbClient: MongoClient
  user: { email: string; id: string }
}

declare module 'next-auth' {
  export interface User {
    id: string
  }
}
