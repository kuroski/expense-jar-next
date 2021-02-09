/* eslint-disable no-redeclare */
import * as t from 'io-ts'
import { DateFromISOString } from 'io-ts-types'
import omit from '@/types/omit'
import Period from '@/types/period'
import Color from '@/types/color'

const Subscription = t.type({
  _id: t.string,
  name: t.string,
  cycleAmount: t.number,
  cyclePeriod: Period,
  icon: t.string,
  overview: t.union([t.string, t.undefined]),
  price: t.number,
  firstBill: DateFromISOString,
  color: Color,
})
type Subscription = t.TypeOf<typeof Subscription>

const SubscriptionFormValues = t.type(omit(Subscription.props, '_id'))
type SubscriptionFormValues = t.TypeOf<typeof SubscriptionFormValues>

export { Period, Subscription, SubscriptionFormValues }
