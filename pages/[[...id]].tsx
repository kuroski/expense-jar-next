import React, { FC, useState } from 'react'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import { Box, Flex, IconButton, SimpleGrid } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import * as types from '../types'
import { connectToDB, subscription } from '../db'
import Subscription from '../components/subscription'

const App: FC<{ subscriptions: types.Subscription[] }> = ({ subscriptions }) => {
  const [allSubscriptions] = useState(subscriptions || [])

  return (
    <Box mt={4}>
      <Flex justify="flex-end">
        <Link href="/subscriptions/new">
          <a>
            <IconButton aria-label="Add new subscription" icon={<AddIcon />} />
          </a>
        </Link>
      </Flex>

      <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
        {allSubscriptions.map((element) => (
          <Subscription {...element} key={element.name} />
        ))}
      </SimpleGrid>
    </Box>
  )
}

export async function getServerSideProps(context) {
  const session: { user: types.UserSession } = await getSession(context)
  // not signed in
  if (!session || !session.user) {
    return { props: {} }
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
