import { fold } from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import useSWR from 'swr'
import { all } from './subscriptions'
import type { Subscription, Subscriptions } from './types'
import * as A from 'fp-ts/lib/Array'

const useSubscriptions = () => {
  const { data, error, mutate } = useSWR<Subscriptions, Error>(
    'subscriptions',
    flow(all(), (e) =>
      e.then(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  return {
    subscriptions: data,
    stats: {
      totalExpenses: pipe(A.reduce<Subscription, number>(0, (acc, subscription) => acc + subscription.price))(
        data || [],
      ),
      // avgExpense:
    },
    isLoading: !error && !data,
    error,
    mutate: () => mutate(),
  }
}
export default useSubscriptions
