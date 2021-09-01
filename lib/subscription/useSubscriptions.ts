import * as RD from '@/lib/remoteData'

import { useEffect, useState } from 'react'

import { Subscription } from '@/lib/subscription/codable'
import { findByListSlug } from '@/lib/subscription/api'
import { flow } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'

type UseSubscriptions = {
  subscriptions: RD.RemoteData<Error, Subscription[]>
  mutate: () => Promise<Subscription[] | undefined>
}

const useSubscriptions = (slug: string): UseSubscriptions => {
  const [subscriptions, setSubscriptions] = useState<RD.RemoteData<Error, Subscription[]>>(RD.pending)
  const { data, error, mutate } = useSWR<Subscription[], Error>(
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

  useEffect(() => {
    if (error) setSubscriptions(RD.failure(error))
    else if (data) setSubscriptions(RD.success(data))
    else setSubscriptions(RD.pending)
  }, [data, error])

  return {
    subscriptions,
    mutate: () => mutate(),
  }
}
export default useSubscriptions
