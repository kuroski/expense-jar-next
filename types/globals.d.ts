/* eslint-disable no-unused-vars */
import '@emotion/react'
import type { Db, MongoClient } from 'mongodb'

declare module '*.svg' {
  const content: string
  export default content
}

declare global {
  namespace NodeJS {
    interface Global {
      mongo: {
        client?: MongoClient
      }
    }

    export interface ProcessEnv {
      GITHUB_ID: string
      GITHUB_SECRET: string
      NEXTAUTH_URL: string
      NEXT_PUBLIC_API_HOST: string
      DATABASE_URL: string
      JWT_SECRET: string
    }
  }
}

declare module 'next' {
  export interface NextApiRequest {
    user: object
    db: Db
    dbClient: MongoClient
  }
}

declare module 'next-auth' {
  export interface User {
    id?: string | null
  }
}
