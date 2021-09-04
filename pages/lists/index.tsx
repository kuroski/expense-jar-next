import * as E from 'fp-ts/lib/Either'
import * as RD from '@/lib/remoteData'
import * as TE from 'fp-ts/lib/TaskEither'
import * as listApi from '@/lib/list/api'

import { Box, Button, Center, Spinner, Stack, Text, VStack, useToast } from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import ListItem from '@/components/listItem'
import React from 'react'
import { getSession } from 'next-auth/client'
import { pipe } from 'fp-ts/lib/function'
import useLists from '@/lib/list/useLists'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

const App = (): JSX.Element => {
  const toast = useToast()
  const remoteData = useLists()
  const router = useRouter()
  const { t } = useTranslation('common')

  function onDeleteList(id: string): TE.TaskEither<Error, List[] | undefined> {
    return pipe(
      id,
      listApi.destroy,
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
            title: t('list_deleted', { name: result.name }),
            status: 'success',
          })
          return TE.tryCatch(remoteData.mutate, E.toError)
        },
      ),
    )
  }

  return RD.fold<Error, List[], JSX.Element>(
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
    (lists) => (
      <VStack align="stretch">
        <Box alignSelf="flex-end" mb="4">
          <Link href="/lists/new">
            <Button colorScheme="blue" leftIcon={<AddIcon />} size="sm">
              {t('create_list')}
            </Button>
          </Link>
        </Box>
        {!lists.length && <Text textAlign="center">{t('empty_subscription')}</Text>}
        {lists.map((list) => (
          <ListItem key={list.id} list={list} onDelete={onDeleteList} />
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
