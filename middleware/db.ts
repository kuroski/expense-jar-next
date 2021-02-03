import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextHandler } from 'next-connect'
import { connectToDB } from '../db/connect'

export default async function database(req: NextApiRequest, _res: NextApiResponse, next: NextHandler) {
  const { db, dbClient } = await connectToDB()
  req.db = db
  req.dbClient = dbClient

  next()
}
