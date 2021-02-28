import { toError } from 'fp-ts/lib/Either'

export type UnauthorizedError = {
  _tag: 'UNAUTHORIZED'
}
export const toUnauthorizedError: UnauthorizedError = { _tag: 'UNAUTHORIZED' }

export type RequestError = {
  _tag: 'REQUEST_ERROR'
  error: Error
}
export const toRequestError = (error: unknown | Error): RequestError => ({
  _tag: 'REQUEST_ERROR',
  error: error instanceof Error ? error : toError(error),
})

export type ApiError = UnauthorizedError | RequestError
