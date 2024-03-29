/* eslint-disable no-redeclare */
import * as t from 'io-ts'

import type { List as ListPrisma, Subscription as SubscriptionPrisma } from '.prisma/client'

import { Subscriptions } from '@/lib/subscription/codable'

export const List = t.type({
  id: t.string,
  urlId: t.string,
  name: t.string,
  currency: t.union([t.string, t.null]),
  userId: t.string,
})
export type List = t.TypeOf<typeof List> extends ListPrisma ? t.TypeOf<typeof List> : never

export const Lists = t.array(List)

export const ListFormValues = t.type({
  name: t.string,
  currency: t.string,
})

export type ListFormValues = t.TypeOf<typeof ListFormValues>

export const ListSubscriptions = t.intersection([List, t.type({ subscriptions: Subscriptions })])
export type ListSubscriptions = t.TypeOf<typeof ListSubscriptions> extends ListPrisma & {
  subscriptions: SubscriptionPrisma[]
}
  ? t.TypeOf<typeof ListSubscriptions>
  : never
