import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { ListSubscriptions, Subscription } from '@/lib/subscription/codable'
import { flow, pipe } from 'fp-ts/lib/function'

import axios from '@/lib/axios'
import { failure } from 'io-ts/lib/PathReporter'

export function findByListSlug(slug: string): TE.TaskEither<Error, ListSubscriptions> {
  return pipe(
    TE.tryCatch(() => axios().get(`lists/${slug}/subscriptions`), E.toError),
    TE.map((response) => response.data),
    TE.chain(
      flow(
        ListSubscriptions.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}

export function destroy(listId: string, id: string): TE.TaskEither<Error, Subscription> {
  return pipe(
    TE.tryCatch(() => axios().delete(`lists/${listId}/subscriptions/${id}`), E.toError),
    TE.map((response) => response.data),
    TE.chain(
      flow(
        Subscription.decode,
        E.mapLeft((errors) => new Error(failure(errors).join('\n'))),
        TE.fromEither,
      ),
    ),
  )
}
