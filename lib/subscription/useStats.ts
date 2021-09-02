import * as A from 'fp-ts/lib/Array'

import { Subscription } from '@/lib/subscription/codable'
import { flow } from 'fp-ts/lib/function'
import isLeapYear from 'date-fns/fp/isLeapYear'

export type UseStats = {
  weeklyExpenses: number
  monthlyExpenses: number
  yearlyExpenses: number
}
type Operation = (subscription: Subscription) => number

const DIVISOR = Math.pow(10, 2)
const now = Date.now()
const DAYS_IN_YEAR = isLeapYear(now) ? 366 : 365
const WEEKS_IN_YEAR = DAYS_IN_YEAR / 7

const roundMonetaryValue = (totalPrice: number): number => Math.round(totalPrice * DIVISOR) / DIVISOR

const weekOperation: Operation = (subscription: Subscription): number => {
  const unitPrice = subscription.price / subscription.cycleAmount
  switch (subscription.cyclePeriod) {
    case 'day':
      return unitPrice * 7

    case 'week':
      return unitPrice

    case 'month':
      return unitPrice / 4.34

    case 'year':
      return unitPrice / WEEKS_IN_YEAR
  }
}

const monthOperation: Operation = (subscription: Subscription): number => {
  const unitPrice = subscription.price / subscription.cycleAmount
  switch (subscription.cyclePeriod) {
    case 'day':
      return unitPrice * 30

    case 'week':
      return unitPrice * 4.34

    case 'month':
      return unitPrice

    case 'year':
      return unitPrice / 12
  }
}

const yearOperation: Operation = (subscription: Subscription): number => {
  const unitPrice = subscription.price / subscription.cycleAmount
  switch (subscription.cyclePeriod) {
    case 'day':
      return unitPrice * DAYS_IN_YEAR

    case 'week':
      return unitPrice * WEEKS_IN_YEAR

    case 'month':
      return unitPrice * 12

    case 'year':
      return unitPrice
  }
}

const calculateStats = (operation: Operation) =>
  flow(
    A.reduce<Subscription, number>(0, (acc, subscription) => acc + operation(subscription)),
    roundMonetaryValue,
  )

const useStats = (subscriptions: Subscription[]): UseStats => ({
  weeklyExpenses: calculateStats(weekOperation)(subscriptions),
  monthlyExpenses: calculateStats(monthOperation)(subscriptions),
  yearlyExpenses: calculateStats(yearOperation)(subscriptions),
})

export default useStats
