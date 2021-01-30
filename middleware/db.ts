import { connectToDB } from '../db/connect'

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface Global {
      mongo: any
    }
  }
}

export default async function database(req, _res, next) {
  const { db, dbClient } = await connectToDB()
  req.db = db
  req.dbClinet = dbClient

  next()
}
