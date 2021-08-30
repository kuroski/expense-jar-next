import * as RD from '@/lib/remoteData'

import { Box, Flex, Stack, StackDivider, Text, VStack } from '@chakra-ui/layout'

import { AddIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/button'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import ListItem from '@/components/listItem'
import React from 'react'
import { Spinner } from '@chakra-ui/spinner'
import { getSession } from 'next-auth/client'
import useLists from '@/lib/list/useLists'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

const App = (): JSX.Element => {
  const remoteData = useLists()
  const router = useRouter()
  const { t } = useTranslation('common')

  return RD.fold<Error, List[], JSX.Element>(
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
    (lists) => (
      <VStack align="stretch">
        <Box alignSelf="flex-end" mb="2">
          <Link href="/lists/new">
            <Button colorScheme="blue" leftIcon={<AddIcon />} size="sm">
              {t('create_list')}
            </Button>
          </Link>
        </Box>
        {lists.map((list) => (
          <ListItem key={list.id} list={list} />
        ))}
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
