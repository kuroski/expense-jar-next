import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { List, ListFormValues, Lists } from '@/lib/list/codable'
import { flow, pipe } from 'fp-ts/lib/function'

import axios from '@/lib/axios'
import { failure } from 'io-ts/lib/PathReporter'

export function all(): TE.TaskEither<Error, List[]> {
  return pipe(
    TE.tryCatch(() => axios().get('lists'), E.toError),
    TE.map((response) => response.data),
    TE.chain(
      flow(
        Lists.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function save(values: ListFormValues): TE.TaskEither<Error, List> {
  return pipe(
    TE.tryCatch(() => axios().post('lists', values), E.toError),
    TE.map((response) => response.data),
    TE.chain(
      flow(
        List.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}
