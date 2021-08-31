import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toNotFound } from '@/lib/errors'
import { List, Subscription } from '.prisma/client'

import { ListFormValues } from '@/lib/list/codable'
import { pipe } from 'fp-ts/lib/function'
import prisma from '@/lib/prisma'
import { string } from 'fp-ts'

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const getLists = (
  email: string,
): TE.TaskEither<
  unknown,
  (List & {
    subscriptions: Subscription[]
  })[]
> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.list.findMany({
          include: {
            subscriptions: true,
          },
          where: {
            createdBy: {
              email,
            },
          },
        }),
      toNotFound,
    ),
  )

export const saveList = (
  email: string,
  values: ListFormValues,
): TE.TaskEither<
  ApiError,
  List & {
    subscriptions: Subscription[]
  }
> =>
  pipe(
    TE.tryCatch(
      () =>
        prisma.list.create({
          data: {
            urlId: slugify(values.name),
            ...values,
            createdBy: {
              connect: {
                email,
              },
            },
          },
          include: {
            subscriptions: true,
          },
        }),
      toNotFound,
    ),
  )

export const deleteList = (email: string, id: string): TE.TaskEither<ApiError, List> =>
  pipe(
    TE.tryCatch(async () => {
      const list = await prisma.list.findUnique({
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
            delete: {
              id,
            },
          },
        },
      })

      return list
    }, toNotFound),
  )
