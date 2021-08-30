import * as RD from '@/lib/remoteData'

import { useEffect, useState } from 'react'

import { List } from '@/lib/list/codable'
import { all } from '@/lib/list/api'
import { flow } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import useSWR from 'swr'

type UseLists = {
  lists: RD.RemoteData<Error, List[]>
  mutate: () => Promise<List[] | undefined>
}

const useLists = (): UseLists => {
  const [lists, setLists] = useState<RD.RemoteData<Error, List[]>>(RD.pending)
  const { data, error, mutate } = useSWR<List[], Error>(
    'lists',
    flow(all(), (e) =>
      e.then(
        fold(
          (errors) => Promise.reject(errors),
          (result) => Promise.resolve(result),
        ),
      ),
    ),
  )

  useEffect(() => {
    if (error) setLists(RD.failure(error))
    else if (data) setLists(RD.success(data))
    else setLists(RD.pending)
  }, [data, error])

  return {
    lists,
    mutate: () => mutate(),
  }
}
export default useLists
