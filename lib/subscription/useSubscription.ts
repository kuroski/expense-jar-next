import * as RD from '@/lib/remoteData'

import { useEffect, useState } from 'react'

import { Subscription } from '@/lib/subscription/codable'
import { flow } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import { getById } from '@/lib/subscription/api'
import useSWR from 'swr'

type UseSubscription = {
  data: RD.RemoteData<Error, Subscription>
  mutate: () => Promise<Subscription | undefined>
}

const useSubscription = (id: string): UseSubscription => {
  const [result, setResult] = useState<RD.RemoteData<Error, Subscription>>(RD.pending)
  const { data, error, mutate } = useSWR<Subscription, Error>(
    `subscriptions/${id}`,
    flow(getById(id), (e) =>
      e.then(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  useEffect(() => {
    if (error) setResult(RD.failure(error))
    else if (data) setResult(RD.success(data))
    else setResult(RD.pending)
  }, [data, error])

  return {
    data: result,
    mutate: () => mutate(),
  }
}
export default useSubscription
