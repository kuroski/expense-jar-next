/* eslint-disable no-redeclare */
import * as t from 'io-ts'
import * as te from 'io-ts-types'

import { DateFromISOString, NumberFromString } from 'io-ts-types'

import type { Subscription as SubscriptionPrisma } from '.prisma/client'

export const Period = t.keyof({
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
})
export type Period = t.TypeOf<typeof Period>

export const Subscription = t.type({
  id: t.string,
  color: t.string,
  cycleAmount: t.number,
  cyclePeriod: t.union([t.literal('day'), t.literal('week'), t.literal('month'), t.literal('year')]),
  firstBill: te.DateFromISOString,
  icon: t.string,
  name: t.string,
  overview: t.union([t.string, t.null]),
  price: t.number,
  listId: t.string,
})

export type Subscription = t.TypeOf<typeof Subscription> extends SubscriptionPrisma
  ? t.TypeOf<typeof Subscription>
  : never

export const Subscriptions = t.array(Subscription)

export const SubscriptionFormValues = t.type({
  name: t.string,
  color: t.string,
  cycleAmount: t.union([t.number, NumberFromString]),
  cyclePeriod: Period,
  overview: t.string,
  price: t.union([t.number, NumberFromString]),
  firstBill: DateFromISOString,
  icon: t.string,
})

export type SubscriptionFormValues = t.TypeOf<typeof SubscriptionFormValues>
