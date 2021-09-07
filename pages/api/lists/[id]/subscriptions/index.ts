import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toDecodingError } from '@/lib/errors'
import { foldResponse, getParam } from '@/lib/utils'
import { getAllByListSlug, saveSubscription } from '@/lib/subscription/db'

import { SubscriptionFormValues } from '@/lib/subscription/codable'
import nextConnect from '@/lib/nextConnect'
import { pipe } from 'fp-ts/lib/function'

const handler = nextConnect()

handler.get((req, res) =>
  pipe(
    getParam(req.query.id),
    TE.fromEither,
    TE.chain((listSlug) => getAllByListSlug(req.user.email, listSlug)),
    foldResponse(res),
  )(),
)

handler.post((req, res) =>
  pipe(
    getParam(req.query.id),
    E.chain<ApiError, string, [string, SubscriptionFormValues]>((listId) =>
      pipe(
        req.body,
        SubscriptionFormValues.decode,
        E.mapLeft(toDecodingError),
        E.map<SubscriptionFormValues, [string, SubscriptionFormValues]>((subscription) => [listId, subscription]),
      ),
    ),
    TE.fromEither,
    TE.chain(([listId, values]) => saveSubscription(listId, values)),
    foldResponse(res),
  )(),
)

export default handler
