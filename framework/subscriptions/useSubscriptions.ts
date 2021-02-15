import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'
import { all } from './subscriptions'
import type { Subscriptions } from './types'

export default () => {
  const { data, error } = useSWR<Subscriptions, Error>('subscriptions', () =>
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
  }
}
