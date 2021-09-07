import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'

import { getLists, saveList } from '@/lib/list/db'

import { ListFormValues } from '@/lib/list/codable'
import { foldResponse } from '@/lib/utils'
import nextConnect from '@/lib/nextConnect'
import { pipe } from 'fp-ts/lib/function'
import { toDecodingError } from '@/lib/errors'

const handler = nextConnect()

handler.get(async (req, res) => pipe(req.user.email, getLists, foldResponse(res))())

handler.post(async (req, res) =>
  pipe(
    req.body,
    ListFormValues.decode,
    E.mapLeft(toDecodingError),
    TE.fromEither,
    TE.chain((values) => saveList(req.user.email, values)),
    foldResponse(res),
  )(),
)

export default handler
