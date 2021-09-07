import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toDecodingError } from '@/lib/errors'
import { foldResponse, getParams } from '@/lib/utils'

import { SubscriptionFormValues } from '@/lib/subscription/codable'
import nextConnect from '@/lib/nextConnect'
import { pipe } from 'fp-ts/lib/function'
import { updateSubscription } from '@/lib/subscription/db'

const handler = nextConnect()

handler.put(async (req, res) =>
  pipe(
    getParams(req.query.id, req.query.subscriptionId),
    E.chain<ApiError, readonly string[], [string, string, SubscriptionFormValues]>(([listId, subscriptionId]) =>
      pipe(
        req.body,
        SubscriptionFormValues.decode,
        E.mapLeft(toDecodingError),
        E.map<SubscriptionFormValues, [string, string, SubscriptionFormValues]>((values) => [
          listId,
          subscriptionId,
          values,
        ]),
      ),
    ),
    TE.fromEither,
    TE.chain(([listId, subscriptionId, values]) => updateSubscription(req.user.email, listId, subscriptionId, values)),
    foldResponse(res),
  )(),
)

export default handler
