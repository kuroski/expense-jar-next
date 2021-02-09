import * as d from 'decoders'

import theme from '@/theme'

export type Period = 'day' | 'week' | 'month' | 'year'
export const PeriodKeys: Period[] = ['day', 'week', 'month', 'year']
export interface Subscription {
  _id: string
  color: typeof theme.colors
  name: string
  cycleAmount: number
  cyclePeriod: Period
  icon: string
  overview?: string
  price: number
  firstBill: Date
}

export type FormValues = {
  name: string
  color: string
  cycleAmount: number
  cyclePeriod: Period
  overview: string
  price: number
  firstBill: Date
  icon: string
}

export function decoder(payload: any): Subscription[] {
  return d.guard(
    d.array(
      d.object({
        _id: d.string,
        color: d.string,
        name: d.string,
        cycleAmount: d.number,
        cyclePeriod: d.oneOf(PeriodKeys),
        icon: d.string,
        overview: d.optional(d.string),
        price: d.number,
        firstBill: d.iso8601,
      }),
    ),
  )(payload)
}

export async function save(values: FormValues) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { data } = await response.json()
  return data
}
