import * as RD from '@/lib/remoteData'
import * as TE from 'fp-ts/lib/TaskEither'

import { AnimatePresence, Variants, motion } from 'framer-motion'
import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/layout'
import { ListSubscriptions, Subscription } from '@/lib/subscription/codable'
import { Stat, StatLabel, StatNumber } from '@chakra-ui/stat'

import { Button } from '@chakra-ui/button'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Spinner } from '@chakra-ui/spinner'
import SubscriptionItem from '@/components/subscriptionItem'
import { getSession } from 'next-auth/client'
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
  const router = useRouter()
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug
  const { data, currencyFormatter, stats } = useSubscriptions(slug || '')
  const { t } = useTranslation('common')

  function onDeleteSubscription(id: string): TE.TaskEither<Error, Subscription | undefined> {
    console.log(id)
    return TE.of(undefined)
    // return pipe(
    //   id,
    //   subscriptionService.destroy,
    //   TE.fold(
    //     (error) => {
    //       toast({
    //         title: t('delete_operation_failed'),
    //         description: error.message,
    //         status: 'error',
    //       })
    //       return TE.left(error)
    //     },
    //     (result) => {
    //       toast({
    //         title: t('subscription_deleted', { name: result.name }),
    //         status: 'success',
    //       })
    //       return TE.tryCatch(mutate, E.toError)
    //     },
    //   ),
    // )
  }

  return RD.fold<Error, ListSubscriptions, JSX.Element>(
    () => <div />,
    () => (
      <Box w="full" textAlign="center">
        <Spinner />
      </Box>
    ),
    () => (
      <Stack>
        <Text>{t('something_wrong')}</Text>
        <Button onClick={router.reload}>{t('refresh')}</Button>
      </Stack>
    ),
    (list) => (
      <Box>
        {!list.subscriptions.length && <Text textAlign="center">{t('empty_subscription')}</Text>}
        <AnimatePresence>
          <SimpleGrid key="stats" spacing={4} columns={[1, 3]}>
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

          <motion.div variants={container} initial="hidden" animate="show">
            <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
              {list.subscriptions.map((subscription: Subscription) => (
                <motion.div
                  key={subscription.id}
                  variants={item}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                >
                  <SubscriptionItem
                    {...subscription}
                    key={subscription.id}
                    onDelete={onDeleteSubscription}
                    currencyFormatter={currencyFormatter}
                  />
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
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