import * as RD from '@/lib/remoteData'

import { Box, Stack, Text } from '@chakra-ui/layout'

import { Button } from '@chakra-ui/button'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Spinner } from '@chakra-ui/spinner'
import { Subscription } from '@/lib/subscription/codable'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import useSubscriptions from '@/lib/subscription/useSubscriptions'
import useTranslation from 'next-translate/useTranslation'

const App = (): JSX.Element => {
  const router = useRouter()
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug
  const remoteData = useSubscriptions(slug || '')
  const { t } = useTranslation('common')

  return RD.fold<Error, Subscription[], JSX.Element>(
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
    (subscriptions) => <div>{JSON.stringify(subscriptions, null, 4)}</div>,
  )(remoteData.subscriptions)
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
