import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import { failure } from 'io-ts/lib/PathReporter'
import { FormValues, List } from './types'

export function all(): TE.TaskEither<Error, List> {
  return pipe(
    TE.tryCatch(() => fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/lists`), E.toError),
    TE.chain((response) => {
      if (!response.ok) {
        return pipe(
          TE.tryCatch(() => response.text(), E.toError),
          TE.fold(TE.left, (a) => TE.left(new Error(a))),
        )
      }
      return TE.of(response)
    }),
    TE.chain((response) => TE.tryCatch((): Promise<{ list: unknown }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ list }) => list,
        List.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function update(id: string) {
  return function (values: FormValues): TE.TaskEither<Error, List> {
    return pipe(
      TE.tryCatch(
        () =>
          fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/lists/${id}`, {
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
      TE.chain((response) => TE.tryCatch((): Promise<{ list: unknown }> => response.json(), E.toError)),
      TE.chain(
        flow(
          ({ list }) => list,
          List.decode,
          E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
          TE.fromEither,
        ),
      ),
    )
  }
}

export function share(): TE.TaskEither<Error, List> {
  return pipe(
    TE.tryCatch(
      () =>
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/lists/share`, {
          method: 'POST',
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
    TE.chain((response) => TE.tryCatch((): Promise<{ list: unknown[] }> => response.json(), E.toError)),
    TE.chain(
      flow(
        ({ list }) => list,
        List.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}
