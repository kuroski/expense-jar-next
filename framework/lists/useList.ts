import { fold } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import useSWR from 'swr'
import { all } from './lists'
import { List } from './types'

type UseLists = {
  list: List | undefined
  isLoading: boolean
  error: Error | undefined
  mutate: () => Promise<List | undefined>
}

const useLists = (): UseLists => {
  const { data, error, mutate } = useSWR<List, Error>(
    'list',
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
    list: data,
    isLoading: !error && !data,
    error,
    mutate: () => mutate(),
  }
}
export default useLists
