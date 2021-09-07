import * as TE from 'fp-ts/lib/TaskEither'

import { foldResponse, getParams } from '@/lib/utils'

import { deleteSubscription } from '@/lib/subscription/db'
import nextConnect from '@/lib/nextConnect'
import { pipe } from 'fp-ts/lib/function'

const handler = nextConnect()

handler.delete(async (req, res) =>
  pipe(
    getParams(req.query.id, req.query.subscriptionId),
    TE.fromEither,
    TE.chain(([listId, id]) => deleteSubscription(req.user.email, listId, id)),
    foldResponse(res),
  )(),
)

export default handler
