import { FormValues } from '@/pages/subscriptions/new'
import { Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'

export async function save(values: FormValues) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text)
  }

  const { data } = await response.json()
  return data
}

export function all(): Promise<E.Either<Error, Subscriptions>> {
  return pipe(
    TE.tryCatch(() => fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription`), E.toError),
    TE.chain((response) => TE.tryCatch((): Promise<{ subscriptions: unknown[] }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ subscriptions }) => subscriptions,
        Subscriptions.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )()
}
