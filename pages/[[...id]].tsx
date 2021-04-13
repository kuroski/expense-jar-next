import React from 'react'
import Link from 'next/link'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useToast,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Subscription from '@/components/subscription'
import useSubscriptions from '@/framework/subscriptions/useSubscriptions'
import * as subscriptionService from '@/framework/subscriptions/subscriptions'
import * as listService from '@/framework/lists/lists'
import SubscriptionsSkeleton from '@/components/subscriptionsSkeleton'
import { MdRefresh } from 'react-icons/md'
import NoData from '@/components/icons/noData'
import Head from 'next/head'
import { flow, pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import * as RD from '@/framework/remoteData'
import * as types from '@/framework/subscriptions/types'
import useList from '@/framework/lists/useList'
import CurrencySelect from '@/components/currencySelect'
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
  const { subscriptions, stats, isLoading, error, mutate } = useSubscriptions()
  const list = useList()
  const { t } = useTranslation('common')

  const [currencyData, setCurrencyData] = React.useState<RD.RemoteData<Error, unknown>>(RD.notAsked)

  const currencyFormatter = Intl.NumberFormat([], { style: 'currency', currency: list.list?.currency || 'EUR' })

  function onDeleteSubscription(id: string): TE.TaskEither<Error, types.Subscriptions | undefined> {
    return pipe(
      id,
      subscriptionService.destroy,
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

  // function onListShared(): TE.TaskEither<Error, listTypes.List | undefined> {
  //   return flow(
  //     listService.share,
  //     TE.fold(
  //       (error) => {
  //         toast({
  //           title: t('share_operation_failed'),
  //           description: error.message,
  //           status: 'error',
  //         })
  //         return TE.left(error)
  //       },
  //       () => {
  //         toast({
  //           title: t('list_shared'),
  //           status: 'success',
  //         })
  //         return TE.tryCatch(list.mutate, E.toError)
  //       },
  //     ),
  //   )()
  // }

  function onCurrencyChanged(code: string): T.Task<void> {
    setCurrencyData(RD.pending)
    return pipe(
      { code },
      listService.update(list.list!._id),
      TE.fold(
        (error) => {
          toast({
            title: t('currency_change_failed'),
            description: error.message,
            status: 'error',
          })
          return TE.left(error)
        },
        () => {
          toast({
            title: t('currency_changed'),
            status: 'success',
          })
          return TE.tryCatch(list.mutate, E.toError)
        },
      ),
      TE.fold<Error, unknown, RD.RemoteData<Error, never> | RD.RemoteData<never, unknown>>(
        flow(RD.failure, T.of),
        flow(RD.success, T.of),
      ),
      T.map(setCurrencyData),
    )
  }

  return (
    <>
      <Head>
        <title>Expense jar</title>
      </Head>
      <Box mt={4}>
        <Flex justify="flex-end">
          <Link href="/subscriptions/new">
            <a>
              <IconButton aria-label={t('add_new_subscription')} icon={<AddIcon />} />
            </a>
          </Link>

          {/* {list.list &&
            (list.list.urlId ? (
              <Flex ml={3} alignItems="center">
                {list.list.urlId}
              </Flex>
            ) : (
              <IconButton ml={3} aria-label={t('share_list')} icon={<LinkIcon />} onClick={onListShared()} />
            ))} */}

          <Box ml={3}>
            <CurrencySelect
              id="currency"
              isLoading={RD.isPending(currencyData) || list.isLoading}
              value={list.list?.currency || ''}
              onSelect={(code) => onCurrencyChanged(code)()}
            />
          </Box>
        </Flex>

        {isLoading && <SubscriptionsSkeleton />}
        {error && (
          <Center display="flex" flexDirection="column">
            <h1>{t('error_ocurred')}</h1>
            <Button mt={2} leftIcon={<MdRefresh />} onClick={mutate}>
              {t('retry')}
            </Button>
          </Center>
        )}
        {!error && subscriptions && subscriptions.length <= 0 && (
          <Stack align="center">
            <Box width={300} height={330} mx="auto" mb={4}>
              <NoData />
            </Box>
            <Heading as="h1" size="md" mb={2}>
              <span>{t('empty_subscription')}</span>
            </Heading>
            <Link href="/subscriptions/new">
              <a>
                <Button aria-label="Add new subscription" rightIcon={<AddIcon />}>
                  {t('add_subscription')}
                </Button>
              </a>
            </Link>
          </Stack>
        )}
        {subscriptions && (
          <AnimatePresence>
            <SimpleGrid key="stats" spacing={4} columns={[1, 3]}>
              <Stat key="avgWeek">
                <StatLabel>{t('avg_week')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.weeklyExpenses)}</StatNumber>
              </Stat>

              <Stat key="avgMonth">
                <StatLabel>{t('avg_month')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.monthlyExpenses)}</StatNumber>
              </Stat>

              <Stat key="avgYear">
                <StatLabel>{t('avg_year')}</StatLabel>
                <StatNumber>{currencyFormatter.format(stats.yearlyExpenses)}</StatNumber>
              </Stat>
            </SimpleGrid>

            <motion.div variants={container} initial="hidden" animate="show">
              <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
                {subscriptions.map((element) => (
                  <motion.div
                    key={element._id}
                    variants={item}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  >
                    <Subscription
                      {...element}
                      key={element._id}
                      onDelete={onDeleteSubscription}
                      currencyFormatter={currencyFormatter}
                    />
                  </motion.div>
                ))}
              </SimpleGrid>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>
    </>
  )
}

export default App
