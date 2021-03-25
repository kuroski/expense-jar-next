import { fold } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import useSWR from 'swr'
import { all } from './subscriptions'
import { Subscriptions } from './types'
import useStats, { UseStats } from './useStats'

type UseSubscriptions = {
  subscriptions: Subscriptions | undefined
  stats: UseStats
  isLoading: boolean
  error: Error | undefined
  mutate: () => Promise<Subscriptions | undefined>
}

const useSubscriptions = (): UseSubscriptions => {
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

  const stats = useStats(data || [])

  return {
    subscriptions: data,
    stats,
    isLoading: !error && !data,
    error,
    mutate: () => mutate(),
  }
}
export default useSubscriptions
