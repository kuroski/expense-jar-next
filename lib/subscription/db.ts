import * as TE from 'fp-ts/lib/TaskEither'

import { Subscription } from '.prisma/client'
import { pipe } from 'fp-ts/lib/function'
import prisma from '@/lib/prisma'
import { toNotFound } from '@/lib/errors'

export const getAllByListSlug = (email: string, slug: string): TE.TaskEither<unknown, Subscription[]> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.list
          .findFirst({
            rejectOnNotFound: true,
            where: {
              createdBy: {
                email,
              },
              urlId: slug,
            },
          })
          .subscriptions(),
      toNotFound,
    ),
  )
