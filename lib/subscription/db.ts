import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toNotFound } from '@/lib/errors'
import { List, Subscription } from '.prisma/client'

import { SubscriptionFormValues } from '@/lib/subscription/codable'
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

export const getSubscription = (id: string): TE.TaskEither<ApiError, Subscription & { list: List }> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.subscription.findUnique({
          include: {
            list: true,
          },
          where: {
            id,
          },
          rejectOnNotFound: true,
        }),
      toNotFound,
    ),
  )

export const updateSubscription = (
  email: string,
  listId: string,
  id: string,
  values: SubscriptionFormValues,
): TE.TaskEither<ApiError, Subscription> =>
  pipe(
    TE.tryCatch(async () => {
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
                  update: {
                    where: {
                      id,
                    },
                    data: {
                      color: values.color,
                      cycleAmount: values.cycleAmount,
                      cyclePeriod: values.cyclePeriod,
                      firstBill: values.firstBill,
                      icon: values.icon,
                      name: values.name,
                      overview: values.overview,
                      price: values.price,
                    },
                  },
                },
              },
            },
          },
        },
      })

      return prisma.subscription.findUnique({
        rejectOnNotFound: true,
        where: {
          id,
        },
      })
    }, toNotFound),
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
