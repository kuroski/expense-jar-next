/* eslint-disable no-redeclare */
import * as t from 'io-ts'
import { DateFromISOString } from 'io-ts-types'
import Period from './period'
// import Color from '@/types/color'

const Subscription = t.type({
  _id: t.string,
  name: t.string,
  cycleAmount: t.number,
  cyclePeriod: Period,
  icon: t.string,
  overview: t.union([t.string, t.undefined]),
  price: t.number,
  firstBill: DateFromISOString,
  color: t.string,
})
type Subscription = t.TypeOf<typeof Subscription>

const Subscriptions = t.array(Subscription)
type Subscriptions = t.TypeOf<typeof Subscriptions>

export { Subscriptions, Subscription }
