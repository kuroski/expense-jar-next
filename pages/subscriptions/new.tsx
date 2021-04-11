import React from 'react'
import { useRouter } from 'next/router'
import { Box, useToast } from '@chakra-ui/react'
import { save } from '@/framework/subscriptions/subscriptions'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import SubscriptionForm from '@/components/subscriptionForm'
import type { FormValues } from '@/framework/subscriptions/types'
import useTranslation from 'next-translate/useTranslation'

const NewSubscription = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation('common')

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
            title: t('error_ocurred'),
            description: errors.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return T.of(Promise.reject(t('error_ocurred')))
        },
        (subscription) => {
          toast({
            title: t('subscription_created', { name: subscription.name }),
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          return T.of(router.push('/'))
        },
      ),
    )

  return (
    <Box mt={10}>
      <SubscriptionForm initialValues={initialValues} title={t('create_subscription')} onSubmit={onSubmit} />
    </Box>
  )
}

export default NewSubscription
