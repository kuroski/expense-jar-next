export type RemoteDataNotAsked = {
  readonly _tag: 'RemoteDataNotAsked'
}

export type RemoteDataPending = {
  readonly _tag: 'RemoteDataPending'
}

export type RemoteDataFailure<E> = {
  readonly _tag: 'RemoteDataFailure'
  readonly error: E
}

export type RemoteDataSuccess<A> = {
  readonly _tag: 'RemoteDataSuccess'
  readonly value: A
}

export type RemoteData<E, A> = RemoteDataNotAsked | RemoteDataPending | RemoteDataFailure<E> | RemoteDataSuccess<A>

export const failure = <E>(error: E): RemoteData<E, never> => ({
  _tag: 'RemoteDataFailure',
  error,
})

export const success = <A>(value: A): RemoteData<never, A> => ({
  _tag: 'RemoteDataSuccess',
  value,
})

export const pending: RemoteData<never, never> = {
  _tag: 'RemoteDataPending',
}

export const notAsked: RemoteData<never, never> = {
  _tag: 'RemoteDataNotAsked',
}

export const isFailure = <E>(data: RemoteData<E, unknown>): data is RemoteDataFailure<E> =>
  data._tag === 'RemoteDataFailure'

export const isSuccess = <A>(data: RemoteData<unknown, A>): data is RemoteDataSuccess<A> =>
  data._tag === 'RemoteDataSuccess'

export const isPending = (data: RemoteData<unknown, unknown>): data is RemoteDataPending =>
  data._tag === 'RemoteDataPending'

export const isNotAsked = (data: RemoteData<unknown, unknown>): data is RemoteDataNotAsked =>
  data._tag === 'RemoteDataNotAsked'

export const fold = <E, A, B>(
  onNotAsked: () => B,
  onPending: () => B,
  onFailure: (error: E) => B,
  onSuccess: (value: A) => B,
) => (ma: RemoteData<E, A>): B => {
  switch (ma._tag) {
    case 'RemoteDataNotAsked':
      return onNotAsked()

    case 'RemoteDataPending':
      return onPending()

    case 'RemoteDataFailure':
      return onFailure(ma.error)

    case 'RemoteDataSuccess':
      return onSuccess(ma.value)
  }
}
