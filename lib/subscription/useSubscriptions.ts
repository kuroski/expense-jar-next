import * as RD from '@/lib/remoteData'

import { useEffect, useState } from 'react'
import useStats, { UseStats } from '@/lib/subscription/useStats'

import { ListSubscriptions } from '@/lib/list/codable'
import { Subscription } from './codable'
import { findByListSlug } from '@/lib/subscription/api'
import { flow } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'

type UseSubscriptions = {
  data: RD.RemoteData<Error, ListSubscriptions>
  stats: UseStats
  currencyFormatter: Intl.NumberFormat
  hiddenSubscriptions: Set<string>
  toggleSubscription: (id: string) => void
  mutate: () => Promise<ListSubscriptions | undefined>
}

const useSubscriptions = (slug: string): UseSubscriptions => {
  const [hiddenSubscriptions, setHiddenSubscriptions] = useState(new Set<string>())
  const [result, setResult] = useState<RD.RemoteData<Error, ListSubscriptions>>(RD.pending)
  const { data, error, mutate } = useSWR<ListSubscriptions, Error>(
    `lists/${slug}/subscriptions`,
    flow(findByListSlug(slug), (e) =>
      e.then(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  const stats = useStats(data?.subscriptions.filter(({ id }: Subscription) => !hiddenSubscriptions.has(id)) || [])

  useEffect(() => {
    if (error) setResult(RD.failure(error))
    else if (data) setResult(RD.success(data))
    else setResult(RD.pending)
  }, [data, error])

  return {
    data: result,
    stats,
    currencyFormatter: Intl.NumberFormat([], { style: 'currency', currency: data?.currency || 'EUR' }),
    hiddenSubscriptions,
    toggleSubscription: (id: string): void => {
      const newSet = new Set(hiddenSubscriptions)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      setHiddenSubscriptions(newSet)
    },
    mutate: () => mutate(),
  }
}
export default useSubscriptions
