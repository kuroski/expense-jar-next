import * as RD from '@/lib/remoteData'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { Button, Center, Spinner, Stack, Text, useToast } from '@chakra-ui/react'
import { Subscription, SubscriptionFormValues } from '@/lib/subscription/codable'

import React from 'react'
import SubscriptionForm from '@/components/subscriptionForm'
import { pipe } from 'fp-ts/lib/function'
import { update } from '@/lib/subscription/api'
import { useRouter } from 'next/router'
import useSubscription from '@/lib/subscription/useSubscription'
import useTranslation from 'next-translate/useTranslation'

type EditFormProps = {
  subscription: Subscription
}
const EditForm = (props: EditFormProps) => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation('common')

  const initialValues: SubscriptionFormValues = {
    name: props.subscription.name,
    color: props.subscription.color,
    cycleAmount: props.subscription.cycleAmount,
    cyclePeriod: props.subscription.cyclePeriod,
    overview: props.subscription.overview ?? '',
    price: props.subscription.price,
    firstBill: props.subscription.firstBill,
    icon: props.subscription.icon,
  }

  const onSubmit = (values: SubscriptionFormValues): T.Task<Promise<boolean>> =>
    pipe(
      values,
      update(props.subscription.listId, props.subscription.id),
      TE.fold(
        (errors) => {
          toast({
            title: t('error_ocurred'),
            description: errors.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
          return T.never
        },
        (subscription) => {
          toast({
            title: t('subscription_updated', { name: subscription.name }),
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          return T.of(
            router.push({
              pathname: '/lists/[slug]',
              query: {
                slug: router.query.slug,
              },
            }),
          )
        },
      ),
    )

  return (
    <SubscriptionForm
      initialValues={initialValues}
      title={t('edit_subscription', { name: props.subscription.name })}
      onSubmit={onSubmit}
    />
  )
}

const EditSubscription = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  const { t } = useTranslation('common')

  const { data } = useSubscription(String(id))

  return RD.fold<Error, Subscription, JSX.Element>(
    () => <div />,
    () => (
      <Center>
        <Spinner />
      </Center>
    ),
    () => (
      <Stack>
        <Text>{t('something_wrong')}</Text>
        <Button onClick={router.reload}>{t('refresh')}</Button>
      </Stack>
    ),
    (subscription) => <EditForm subscription={subscription} />,
  )(data)
}

export default EditSubscription
