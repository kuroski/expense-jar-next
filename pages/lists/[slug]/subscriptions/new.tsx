import * as E from 'fp-ts/lib/Either'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as subscriptionApi from '@/lib/subscription/api'

import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, useToast } from '@chakra-ui/react'

import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import React from 'react'
import SubscriptionForm from '@/components/subscriptionForm'
import { SubscriptionFormValues } from '@/lib/subscription/codable'
import { findListBySlug } from '@/lib/list/db'
import { getSession } from 'next-auth/client'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

type NewSubscriptionProps = {
  list: List
}

const NewSubscription = (props: NewSubscriptionProps): JSX.Element => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation('common')

  const initialValues: SubscriptionFormValues = {
    name: '',
    color: 'grey',
    cycleAmount: 1,
    cyclePeriod: 'month',
    overview: '',
    price: 0.0,
    firstBill: new Date(),
    icon: '',
  }

  const onSubmit = (values: SubscriptionFormValues): T.Task<Promise<boolean>> =>
    pipe(
      values,
      subscriptionApi.save(props.list.id),
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
            {t('home_page')}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} href={`/lists/${props.list.urlId}`}>
            {props.list.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink isCurrentPage>{t('add_new_subscription')}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <SubscriptionForm initialValues={initialValues} title={t('add_new_subscription')} onSubmit={onSubmit} />
    </Box>
  )
}

export default NewSubscription

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  return pipe(findListBySlug(String(session?.user?.email), String(context.query.slug)), (result) =>
    result().then(
      E.fold(
        (error) => Promise.reject(error),
        (list) =>
          Promise.resolve({
            props: {
              list,
            },
          }),
      ),
    ),
  )
}
