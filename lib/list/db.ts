import * as TE from 'fp-ts/lib/TaskEither'

import { ApiError, toNotFound } from '@/lib/errors'
import { List, Subscription } from '.prisma/client'

import { ListFormValues } from '@/lib/list/codable'
import { pipe } from 'fp-ts/lib/function'
import prisma from '@/lib/prisma'

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
