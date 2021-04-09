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
import * as E from 'fp-ts/lib/Either'
import * as types from '@/framework/subscriptions/types'
import * as listTypes from '@/framework/lists/types'
import useLists from '@/framework/lists/useList'

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
  const list = useLists()

  function onDeleteSubscription(id: string): TE.TaskEither<Error, types.Subscriptions | undefined> {
    return pipe(
      id,
      subscriptionService.destroy,
      TE.fold(
        (error) => {
          toast({
            title: 'Delete operation failed',
            description: error.message,
            status: 'error',
          })
          return TE.left(error)
        },
        (result) => {
          toast({
            title: `Subscription ${result.name} was deleted with success`,
            status: 'success',
          })
          return TE.tryCatch(mutate, E.toError)
        },
      ),
    )
  }

  function onListShared(): TE.TaskEither<Error, listTypes.List | undefined> {
    return flow(
      listService.share,
      TE.fold(
        (error) => {
          toast({
            title: 'Share operation failed',
            description: error.message,
            status: 'error',
          })
          return TE.left(error)
        },
        () => {
          toast({
            title: 'List shared with success',
            status: 'success',
          })
          return TE.tryCatch(list.mutate, E.toError)
        },
      ),
    )()
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
              <IconButton aria-label="Add new subscription" icon={<AddIcon />} />
            </a>
          </Link>

          {list.list &&
            (list.list.urlId ? (
              <div>{list.list.urlId}</div>
            ) : (
              <Button onClick={() => onListShared()()}>Share your list</Button>
            ))}
        </Flex>

        {isLoading && <SubscriptionsSkeleton />}
        {error && (
          <Center display="flex" flexDirection="column">
            <h1>An error ocurred!</h1>
            <Button mt={2} leftIcon={<MdRefresh />} onClick={mutate}>
              Retry
            </Button>
          </Center>
        )}
        {!error && subscriptions && subscriptions.length <= 0 && (
          <Stack align="center">
            <Box width={300} height={330} mx="auto" mb={4}>
              <NoData />
            </Box>
            <Heading as="h1" size="md" mb={2}>
              <span>Things are a bit empty here, let&apos;s</span>
            </Heading>
            <Link href="/subscriptions/new">
              <a>
                <Button aria-label="Add new subscription" rightIcon={<AddIcon />}>
                  Add a subscription
                </Button>
              </a>
            </Link>
          </Stack>
        )}
        {subscriptions && (
          <AnimatePresence>
            <SimpleGrid key="stats" spacing={4} columns={[1, 3]}>
              <Stat key="avgWeek">
                <StatLabel>Avg per week</StatLabel>
                <StatNumber>€ {stats.weeklyExpenses}</StatNumber>
              </Stat>

              <Stat key="avgMonth">
                <StatLabel>Avg per month</StatLabel>
                <StatNumber>€ {stats.monthlyExpenses}</StatNumber>
              </Stat>

              <Stat key="avgYear">
                <StatLabel>Avg per year</StatLabel>
                <StatNumber>€ {stats.yearlyExpenses}</StatNumber>
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
                    <Subscription {...element} key={element._id} onDelete={onDeleteSubscription} />
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
