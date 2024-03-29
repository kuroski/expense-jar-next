import * as E from 'fp-ts/lib/Either'
import * as RD from '@/lib/remoteData'
import * as TE from 'fp-ts/lib/TaskEither'
import * as subscriptionApi from '@/lib/subscription/api'

import { AnimatePresence, Variants, motion } from 'framer-motion'
import {
  Box,
  Button,
  Center,
  SimpleGrid,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { ListSubscriptions } from '@/lib/list/codable'
import React from 'react'
import { Subscription } from '@/lib/subscription/codable'
import SubscriptionItem from '@/components/subscriptionItem'
import { getSession } from 'next-auth/client'
import { pipe } from 'fp-ts/lib/function'
import { useRouter } from 'next/router'
import useSubscriptions from '@/lib/subscription/useSubscriptions'
import useTranslation from 'next-translate/useTranslation'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
}

const App = (): JSX.Element => {
  const toast = useToast()
  const router = useRouter()
  const { data, currencyFormatter, stats, hiddenSubscriptions, mutate, toggleSubscription } = useSubscriptions(
    String(router.query.slug),
  )
  const { t } = useTranslation('common')

  function onDeleteSubscription(listId: string, id: string): TE.TaskEither<Error, ListSubscriptions | undefined> {
    return pipe(
      subscriptionApi.destroy(listId, id),
      TE.fold(
        (error) => {
          toast({
            title: t('delete_operation_failed'),
            description: error.message,
            status: 'error',
          })
          return TE.left(error)
        },
        (result) => {
          toast({
            title: t('subscription_deleted', { name: result.name }),
            status: 'success',
          })
          return TE.tryCatch(mutate, E.toError)
        },
      ),
    )
  }

  return RD.fold<Error, ListSubscriptions, JSX.Element>(
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
    (list) => (
      <Box>
        <AnimatePresence>
          <>
            <SimpleGrid spacing={4} columns={[1, 3]}>
              <Stat key="avgWeek">
                <StatLabel>{t('avg_week')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.weeklyExpenses)}</StatNumber>
              </Stat>

              <Stat key="avgMonth" justifySelf="center">
                <StatLabel>{t('avg_month')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.monthlyExpenses)}</StatNumber>
              </Stat>

              <Stat key="avgYear" justifySelf="flex-end">
                <StatLabel>{t('avg_year')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.yearlyExpenses)}</StatNumber>
              </Stat>
            </SimpleGrid>

            <Box textAlign="right" my="4">
              <Link
                href={{
                  pathname: '/lists/[slug]/subscriptions/new',
                  query: {
                    slug: String(router.query.slug),
                  },
                }}
              >
                <Button colorScheme="blue" leftIcon={<AddIcon />} size="sm">
                  {t('create_subscription')}
                </Button>
              </Link>
            </Box>

            {!list.subscriptions.length && (
              <Text mt="10" textAlign="center">
                {t('empty_subscription')}
              </Text>
            )}

            <motion.div variants={container} initial="hidden" animate="show">
              <SimpleGrid spacing={2} mt={4}>
                {list.subscriptions.map((subscription: Subscription) => (
                  <motion.div
                    key={subscription.id}
                    variants={item}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  >
                    <SubscriptionItem
                      {...subscription}
                      isHidden={hiddenSubscriptions.has(subscription.id)}
                      onDelete={onDeleteSubscription}
                      onToggleHide={toggleSubscription}
                      currencyFormatter={currencyFormatter}
                    />
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          </>
        </AnimatePresence>
      </Box>
    ),
  )(data)
}

export default App

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  if (!session?.user?.email)
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: true,
      },
    }

  return { props: {} }
}
