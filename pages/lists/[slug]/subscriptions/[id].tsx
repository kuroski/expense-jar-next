import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as subscriptionApi from '@/lib/subscription/api'

import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react'
import { Subscription, SubscriptionFormValues } from '@/lib/subscription/codable'

import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import React from 'react'
import SubscriptionForm from '@/components/subscriptionForm'
import { getSession } from 'next-auth/client'
import { getSubscription } from '@/lib/subscription/db'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

type EditSubscriptionProps = {
  subscription: Subscription & { list: List }
}

const EditSubscription = (props: EditSubscriptionProps): JSX.Element => {
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
      subscriptionApi.update(props.subscription.listId, props.subscription.id),
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
    <Box>
      <Breadcrumb mb="6">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href="/lists">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/lists/${props.subscription.list.urlId}`}>
            {props.subscription.list.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink isCurrentPage>New list</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <SubscriptionForm
        initialValues={initialValues}
        title={t('edit_subscription', { name: props.subscription.name })}
        onSubmit={onSubmit}
      />
    </Box>
  )
}

export default EditSubscription

export const getServerSideProps: GetServerSideProps = async (context) => {
  await getSession(context)
  return pipe(getSubscription(String(context.query.id)), (result) =>
    result().then(
      E.fold(
        (error) => Promise.reject(error),
        (subscription) =>
          Promise.resolve({
            props: {
              subscription,
            },
          }),
      ),
    ),
  )
}
