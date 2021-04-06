import * as t from 'io-ts'
import { DateFromISOString, NumberFromString } from 'io-ts-types'
import { Period } from '@/framework/subscriptions/types'

const FormValues = t.type({
  name: t.string,
  color: t.string,
  cycleAmount: NumberFromString,
  cyclePeriod: Period,
  overview: t.string,
  price: NumberFromString,
  firstBill: DateFromISOString,
  icon: t.string,
})
type FormValues = t.TypeOf<typeof FormValues>

export default FormValues
