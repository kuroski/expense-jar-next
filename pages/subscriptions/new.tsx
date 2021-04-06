import React from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { save } from '@/framework/subscriptions/subscriptions'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import SubscriptionForm from '@/components/subscriptionForm'
import type { FormValues } from '@/framework/subscriptions/types'

const NewSubscription = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()

  const initialValues: FormValues = {
    name: '',
    color: '#000000',
    cycleAmount: 1,
    cyclePeriod: 'month',
    overview: '',
    price: 0,
    firstBill: new Date(),
    icon: '',
  }
  const onSubmit = (values: FormValues): T.Task<Promise<boolean>> =>
    pipe(
      values,
      save,
      TE.fold(
        (errors) => {
          toast({
            title: 'An error ocurred',
            description: errors.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return T.never
        },
        (subscription) => {
          toast({
            title: `Subscription "${subscription.name}" created`,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          return T.of(router.push('/'))
        },
      ),
    )

  return <SubscriptionForm initialValues={initialValues} title="Create new subscription" onSubmit={onSubmit} />
}

export default NewSubscription
