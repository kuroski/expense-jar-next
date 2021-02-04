import 'next-auth'
import theme from './theme'

type Period = 'day' | 'week' | 'month' | 'year'
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
