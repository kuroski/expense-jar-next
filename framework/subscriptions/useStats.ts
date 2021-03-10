import { flow } from 'fp-ts/lib/function'
import type { Subscription } from './types'
import * as A from 'fp-ts/lib/Array'

const DIVISOR = Math.pow(10, 2)

const roundMonetaryValue = (totalPrice: number): number => Math.round(totalPrice * DIVISOR) / DIVISOR

const monthOperation = (subscription: Subscription): number => {
  switch (subscription.cyclePeriod) {
    case 'day':
      return (30 / subscription.cycleAmount) * subscription.price

    case 'week':
      return (4 / subscription.cycleAmount) * subscription.price

    case 'month':
      return subscription.cycleAmount * subscription.price

    case 'year':
      return (subscription.cycleAmount * subscription.price) / 12
  }
}

const useStats = (subscriptions: Subscription[]) => ({
  monthlyExpenses: flow(
    A.reduce<Subscription, number>(0, (acc, subscription) => acc + monthOperation(subscription)),
    roundMonetaryValue,
  )(subscriptions),
})

export default useStats
