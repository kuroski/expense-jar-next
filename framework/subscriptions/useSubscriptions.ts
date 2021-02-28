import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'
import { all } from './subscriptions'
import type { Subscriptions } from './types'

const useSubscriptions = () => {
  const { data, error, mutate } = useSWR<Subscriptions, Error>('subscriptions', () =>
    all().then(
      fold(
        (errors) => Promise.reject(errors),
        (result) => Promise.resolve(result),
      ),
    ),
  )

  return {
    subscriptions: data,
    isLoading: !error && !data,
    error,
    mutate: () => mutate(),
  }
}
export default useSubscriptions
