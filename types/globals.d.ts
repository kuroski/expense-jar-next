import '@emotion/react'
import type { Db, MongoClient } from 'mongodb'
import type { User as AuthUser } from 'next-auth'

declare module '*.svg' {
  const content: string
  export default content
}

declare global {
  export namespace NodeJS {
    export interface Global {
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
    user: AuthUser
    db: Db
    dbClient: MongoClient
  }
}

declare module 'next-auth' {
  export interface User {
    id?: string | null | unknown
  }
}
