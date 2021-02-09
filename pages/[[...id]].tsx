import React, { useState } from 'react'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import { Box, Flex, IconButton, SimpleGrid } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { GetServerSideProps } from 'next'
import { connectToDB, subscription } from '@/db'
import type * as types from '@/services/subscriptions'
import Subscription from '@/components/subscription'

type Props = {
  subscriptions: types.Subscription[]
}

const App = ({ subscriptions }: Props) => {
  const [allSubscriptions] = useState(subscriptions || [])

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

      <AnimatePresence>
        <motion.div variants={container} initial="hidden" animate="show">
          <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
            {allSubscriptions.map((element) => (
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
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  // not signed in
  if (!session || !session.user || !session.user.id) {
    return { props: { subscriptions: [] } }
  }

  const props: any = { session }
  const { db } = await connectToDB()
  const subscriptions = await subscription.getSubscriptions(db, session.user.id)
  props.subscriptions = subscriptions

  return {
    props,
  }
}

export default App
