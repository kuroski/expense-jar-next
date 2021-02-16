import React from 'react'
import Link from 'next/link'
import { Box, Button, Center, Flex, IconButton, SimpleGrid } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Subscription from '@/components/subscription'
import useSubscriptions from '@/framework/subscriptions/useSubscriptions'
import SubscriptionsSkeleton from '@/components/subscriptionsSkeleton'
import { MdRefresh } from 'react-icons/md'

const App = () => {
  const { subscriptions, isLoading, error, mutate } = useSubscriptions()

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

  return (
    <Box mt={4}>
      <Flex justify="flex-end">
        <Link href="/subscriptions/new">
          <a>
            <IconButton aria-label="Add new subscription" icon={<AddIcon />} />
          </a>
        </Link>
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
      {subscriptions && (
        <AnimatePresence>
          <motion.div variants={container} initial="hidden" animate="show">
            <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
              {subscriptions.map((element) => (
                <motion.div
                  key={element._id}
                  variants={item}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                >
                  <Subscription {...element} key={element._id} />
                </motion.div>
              ))}
            </SimpleGrid>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  )
}

export default App
