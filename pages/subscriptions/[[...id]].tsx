import { Box, Button, Center, useToast } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import useSubscription from '@/framework/subscriptions/useSubscription'
import { MdRefresh } from 'react-icons/md'
import { update } from '@/framework/subscriptions/subscriptions'
import { pipe } from 'fp-ts/lib/function'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import SubscriptionForm from '@/components/subscriptionForm'
import type { FormValues, Subscription } from '@/framework/subscriptions/types'
import useTranslation from 'next-translate/useTranslation'

type EditFormProps = {
  subscription: Subscription
}
const EditForm = (props: EditFormProps) => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation('common')

  const initialValues: FormValues = {
    name: props.subscription.name,
    color: props.subscription.color,
    cycleAmount: props.subscription.cycleAmount,
    cyclePeriod: props.subscription.cyclePeriod,
    overview: props.subscription.overview ?? '',
    price: props.subscription.price,
    firstBill: props.subscription.firstBill,
    icon: props.subscription.icon,
  }

  const onSubmit = (values: FormValues): T.Task<Promise<boolean>> =>
    pipe(
      values,
      update(props.subscription._id),
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
          return T.of(router.push('/'))
        },
      ),
    )

  return <SubscriptionForm initialValues={initialValues} title={t('create_subscription')} onSubmit={onSubmit} />
}

const EditSubscription = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  const { t } = useTranslation('common')

  const { subscription, isLoading, error, mutate } = useSubscription(String(id))

  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      {isLoading && <div>{t('loading')}</div>}
      {error && (
        <Center display="flex" flexDirection="column">
          <h1>{t('error_ocurred')}</h1>
          <Button mt={2} leftIcon={<MdRefresh />} onClick={mutate}>
            {t('retry')}
          </Button>
        </Center>
      )}
      {subscription && <EditForm subscription={subscription} />}
    </Box>
  )
}

export default EditSubscription
