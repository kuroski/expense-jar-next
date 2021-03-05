import { FormValues } from '@/pages/subscriptions/new'
import { Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'
import { left } from 'fp-ts/lib/These'

export async function save(values: FormValues) {
  return pipe(
    TE.tryCatch(
      () =>
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
          method: 'POST',
          body: JSON.stringify(values),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      E.toError,
    ),
    TE.chain((response) => TE.tryCatch(() => response.json(), E.toError)),
    // TE.chain(async (response) => {
    //   // if (response.ok) return TE.tryCatch(response.json, E.toError)
    //   // const bla = pipe(TE.tryCatch(response.text, E.toError), TE.chain(flow(TE.fromEither)))()
    //   // return bla

    //   if (!response.ok) {
    //     const text = await response.text()
    //     throw new Error(text)
    //   }

    //   const { data } = await response.json()
    //   return data
    // }),
  )()
}

export function all(): TE.TaskEither<Error, Subscriptions> {
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
    )
  )
}