import { pipe } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'
import { all } from './subscriptions'

export default () => {
  const { data, error } = useSWR('subscriptions', () =>
    all().then(
      pipe(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  return {
    subscriptions: data,
    isLoading: !error && !data,
    error,
  }
}
