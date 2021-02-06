import type { Period } from '@/types'

export const PeriodKeys: Period[] = ['day', 'week', 'month', 'year']

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
