import * as RD from '@/lib/remoteData'

import { Box, Link, Stack, StackDivider, Text, VStack } from '@chakra-ui/layout'

import { AddIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/button'
import { GetServerSideProps } from 'next'
import { List } from '@/lib/list/codable'
import ListItem from '@/components/listItem'
import React from 'react'
import { Spinner } from '@chakra-ui/spinner'
import { getSession } from 'next-auth/client'
import useLists from '@/lib/list/useLists'
import { useRouter } from 'next/router'

const App = (): JSX.Element => {
  const remoteData = useLists()
  const router = useRouter()

  return RD.fold<Error, List[], JSX.Element>(
    () => <div />,
    () => (
      <Box w="full" textAlign="center">
        <Spinner />
      </Box>
    ),
    () => (
      <Stack>
        <Text>Oops, something went wrong, please</Text>
        <Button onClick={router.reload}>Refresh</Button>
      </Stack>
    ),
    (lists) => (
      <VStack divider={<StackDivider borderColor="gray.700" />} spacing={4} align="stretch">
        <Link href="/lists/new">
          <Button width="full" colorScheme="blue" leftIcon={<AddIcon />}>
            Create a list
          </Button>
        </Link>
        {lists.map(ListItem)}
      </VStack>
    ),
  )(remoteData.lists)
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
