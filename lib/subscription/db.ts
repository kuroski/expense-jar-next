import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toNotFound } from '@/lib/errors'
import { List, Subscription } from '.prisma/client'

import { pipe } from 'fp-ts/lib/function'
import prisma from '@/lib/prisma'

export const getAllByListSlug = (
  email: string,
  slug: string,
): TE.TaskEither<unknown, List & { subscriptions: Subscription[] }> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.list.findFirst({
          rejectOnNotFound: true,
          where: {
            createdBy: {
              email,
            },
            urlId: slug,
          },
          include: {
            subscriptions: true,
          },
        }),
      toNotFound,
    ),
  )

export const deleteSubscription = (email: string, listId: string, id: string): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch(async () => {
      const subscription = await prisma.subscription.findUnique({
        where: {
          id,
        },
        rejectOnNotFound: true,
      })

      await prisma.user.update({
        where: {
          email,
        },
        data: {
          lists: {
            update: {
              where: {
                id: listId,
              },
              data: {
                subscriptions: {
                  delete: {
                    id,
                  },
                },
              },
            },
          },
        },
      })

      return subscription
    }, toNotFound),
  )
