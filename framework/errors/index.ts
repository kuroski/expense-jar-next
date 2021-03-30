import * as E from 'fp-ts/lib/Either'
import { ValidationError } from 'io-ts'
import { failure } from 'io-ts/lib/PathReporter'

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
  error: error instanceof Error ? error : E.toError(error),
})

export type MissingParam = {
  _tag: 'MISSING_PARAM'
  error: Error
}
export const toMissingParam = (message: string): MissingParam => ({
  _tag: 'MISSING_PARAM',
  error: E.toError(message),
})

export type DecodingError = {
  _tag: 'DECODING_ERROR'
  error: Error
}
export const toDecodingError = (error: ValidationError[] | Error): DecodingError => ({
  _tag: 'DECODING_ERROR',
  error: error instanceof Error ? error : new Error(failure(error).join('\n')),
})

export type ApiError = UnauthorizedError | RequestError | MissingParam | DecodingError
