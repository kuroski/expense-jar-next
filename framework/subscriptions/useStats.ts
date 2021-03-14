import { flow } from 'fp-ts/lib/function'
import type { Subscription } from './types'
import * as A from 'fp-ts/lib/Array'

type Operation = (subscription: Subscription) => number

const DIVISOR = Math.pow(10, 2)

const roundMonetaryValue = (totalPrice: number): number => Math.round(totalPrice * DIVISOR) / DIVISOR

const weekOperation: Operation = (subscription: Subscription): number => {
  switch (subscription.cyclePeriod) {
    case 'day':
      return (7 / subscription.cycleAmount) * subscription.price
    // return (subscription.price / subscription.cycleAmount) * 7

    case 'week':
      return subscription.price / subscription.cycleAmount

    case 'month':
      return subscription.price / subscription.cycleAmount / 4.3

    case 'year':
      return subscription.price / subscription.cycleAmount / 52
  }
}

const monthOperation: Operation = (subscription: Subscription): number => {
  switch (subscription.cyclePeriod) {
    case 'day':
      // return (30 / subscription.cycleAmount) * subscription.price
      return (subscription.price / subscription.cycleAmount) * 30

    case 'week':
      // return (4 / subscription.cycleAmount) * subscription.price
      return (subscription.price / subscription.cycleAmount) * 4.3

    case 'month':
      return subscription.price / subscription.cycleAmount

    case 'year':
      return subscription.price / subscription.cycleAmount / 12
  }
}

const yearOperation: Operation = (subscription: Subscription): number => {
  switch (subscription.cyclePeriod) {
    case 'day':
      // return (365 / subscription.cycleAmount) * subscription.price
      return (subscription.price / subscription.cycleAmount) * 365

    case 'week':
      // return (52 / subscription.cycleAmount) * subscription.price
      return (subscription.price / subscription.cycleAmount) * 52

    case 'month':
      // return (12 / subscription.cycleAmount) * subscription.price
      return (subscription.price / subscription.cycleAmount) * 12

    case 'year':
      return subscription.price / subscription.cycleAmount
  }
}

const calculateStats = (operation: Operation) =>
  flow(
    A.reduce<Subscription, number>(0, (acc, subscription) => acc + operation(subscription)),
    roundMonetaryValue,
  )

const useStats = (subscriptions: Subscription[]) => ({
  weeklyExpenses: calculateStats(weekOperation)(subscriptions),
  monthlyExpenses: calculateStats(monthOperation)(subscriptions),
  yearlyExpenses: calculateStats(yearOperation)(subscriptions),
})

export default useStats
