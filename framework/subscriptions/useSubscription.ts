import { fold } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import useSWR from 'swr'
import { show } from './subscriptions'
import { Subscription } from './types'

type UseSubscription = {
  subscription: Subscription | undefined
  isLoading: boolean
  error: Error | undefined
  mutate: () => Promise<Subscription | undefined>
}

const useSubscription = (subscriptionId: string): UseSubscription => {
  const { data, error, mutate } = useSWR<Subscription, Error>(
    'subscription',
    flow(show(subscriptionId), (e) =>
      e.then(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  return {
    subscription: data,
    isLoading: !error && !data,
    error,
    mutate: () => mutate(),
  }
}
export default useSubscription
