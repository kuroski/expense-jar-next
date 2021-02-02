import { Db, MongoClient } from 'mongodb'
import { NextApiRequest } from 'next'
import 'next-auth'
import theme from './theme'

type Period = 'day' | 'week' | 'month' | 'year'
export interface Subscription {
  id: string
  color: typeof theme.colors
  name: string
  cycleAmount: number
  cyclePeriod: Period
  icon: string
  overview?: string
  price: number
  firstBill: Date
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
