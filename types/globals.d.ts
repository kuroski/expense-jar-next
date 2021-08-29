import '@emotion/react'
import type { User as AuthUser } from 'next-auth'

declare global {
  export namespace NodeJS {
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
  }
}
