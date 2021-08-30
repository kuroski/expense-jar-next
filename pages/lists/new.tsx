import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { Box, useToast } from '@chakra-ui/react'

import { GetServerSideProps } from 'next'
import ListForm from '@/components/listForm'
import type { ListFormValues } from '@/lib/list/codable'
import React from 'react'
import { getSession } from 'next-auth/client'
import { pipe } from 'fp-ts/lib/function'
import { save } from '@/lib/list/api'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

const NewList = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation('common')

  const initialValues: ListFormValues = {
    name: '',
    currency: '',
  }
  const onSubmit = (values: ListFormValues): T.Task<Promise<boolean>> =>
    pipe(
      values,
      save,
      TE.fold(
        (errors) => {
          toast({
            title: t('error_ocurred'),
            description: errors.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          })

          console.log(errors)
          return T.of(Promise.reject(t('error_ocurred')))
        },
        (list) => {
          toast({
            title: t('list_created', { name: list.name }),
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
          return T.of(router.push('/'))
        },
      ),
    )

  return (
    <Box mt={10}>
      <ListForm initialValues={initialValues} title={t('create_list')} onSubmit={onSubmit} />
    </Box>
  )
}

export default NewList

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
