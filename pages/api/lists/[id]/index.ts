import * as TE from 'fp-ts/lib/TaskEither'

import { foldResponse, getParam } from '@/lib/utils'

import { deleteList } from '@/lib/list/db'
import nextConnect from '@/lib/nextConnect'
import { pipe } from 'fp-ts/lib/function'

const handler = nextConnect()

handler.delete(async (req, res) =>
  pipe(
    req.query.id,
    getParam,
    TE.fromEither,
    TE.chain((listId) => deleteList(req.user.email, listId)),
    foldResponse(res),
  )(),
)

export default handler
