import { FormValues } from '@/framework/subscriptions/types'
import { Subscription, Subscriptions } from '@/framework/subscriptions/types'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'

export function save(values: FormValues): TE.TaskEither<Error, Subscription> {
  return pipe(
    TE.tryCatch(
      () =>
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscriptions/`, {
          method: 'POST',
          body: JSON.stringify(FormValues.encode(values)),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      E.toError,
    ),
    TE.chain((response) => {
      if (!response.ok) {
        return pipe(
          TE.tryCatch(() => response.text(), E.toError),
          TE.fold(TE.left, (a) => TE.left(new Error(a))),
        )
      }
      return TE.of(response)
    }),
    TE.chain((response) => TE.tryCatch((): Promise<{ subscription: unknown[] }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ subscription }) => subscription,
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function update(id: string) {
  return function (values: FormValues): TE.TaskEither<Error, Subscription> {
    return pipe(
      TE.tryCatch(
        () =>
          fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscriptions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(FormValues.encode(values)),
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        E.toError,
      ),
      TE.chain((response) => {
        if (!response.ok) {
          return pipe(
            TE.tryCatch(() => response.text(), E.toError),
            TE.fold(TE.left, (a) => TE.left(new Error(a))),
          )
        }
        return TE.of(response)
      }),
      TE.chain((response) => TE.tryCatch((): Promise<{ subscription: unknown[] }> => response.json(), E.toError)),
      TE.chain(
        flow(
          ({ subscription }) => subscription,
          Subscription.decode,
          E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
          TE.fromEither,
        ),
      ),
    )
  }
}

export function all(): TE.TaskEither<Error, Subscriptions> {
  return pipe(
    TE.tryCatch(() => fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscriptions`), E.toError),
    TE.chain((response) => {
      if (!response.ok) {
        return pipe(
          TE.tryCatch(() => response.text(), E.toError),
          TE.fold(TE.left, (a) => TE.left(new Error(a))),
        )
      }
      return TE.of(response)
    }),
    TE.chain((response) => TE.tryCatch((): Promise<{ subscriptions: unknown[] }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ subscriptions }) => subscriptions,
        Subscriptions.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function show(subscriptionId: string): TE.TaskEither<Error, Subscription> {
  return pipe(
    TE.tryCatch(() => fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscriptions/${subscriptionId}`), E.toError),
    TE.chain((response) => {
      if (!response.ok) {
        return pipe(
          TE.tryCatch(() => response.text(), E.toError),
          TE.fold(TE.left, (a) => TE.left(new Error(a))),
        )
      }
      return TE.of(response)
    }),
    TE.chain((response) => TE.tryCatch((): Promise<{ subscription: unknown }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ subscription }) => subscription,
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function destroy(id: string): TE.TaskEither<Error, Subscription> {
  return pipe(
    TE.tryCatch(
      () =>
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscriptions/${id}`, {
          method: 'DELETE',
        }),
      E.toError,
    ),
    TE.chain((response) => {
      if (!response.ok) {
        return pipe(
          TE.tryCatch(() => response.text(), E.toError),
          TE.fold(TE.left, (a) => TE.left(new Error(a))),
        )
      }
      return TE.of(response)
    }),
    TE.chain((response) => TE.tryCatch((): Promise<{ subscription: unknown }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ subscription }) => subscription,
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}
