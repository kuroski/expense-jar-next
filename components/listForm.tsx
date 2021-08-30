import * as T from 'fp-ts/lib/Task'
import * as Yup from 'yup'

import { Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react'

import CurrencySelect from './currencySelect'
import type { FormikHelpers } from 'formik'
import Head from 'next/head'
import { ListFormValues } from '@/lib/list/codable'
import React from 'react'
import type { Translate } from 'next-translate'
import { useFormik } from 'formik'
import useTranslation from 'next-translate/useTranslation'

const ListSchema = (t: Translate) =>
  Yup.object().shape({
    name: Yup.string().required(t('required_field', { field: 'name' })),
    currency: Yup.string().required(t('required_field', { field: 'currency' })),
  })

export type ListFormProps = {
  title: string
  initialValues: ListFormValues
  onSubmit: (values: ListFormValues, formikHelpers: FormikHelpers<ListFormValues>) => T.Task<Promise<boolean>>
}

const ListForm = (props: ListFormProps): JSX.Element => {
  const { t } = useTranslation('common')
  const form = useFormik({
    initialValues: props.initialValues,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    validationSchema: React.useMemo(() => ListSchema(t), []),
    onSubmit: (values, formikHelpers) => props.onSubmit(values, formikHelpers)(),
  })

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <form onSubmit={form.handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="currency" isInvalid={Boolean(form.errors.currency && form.touched.currency)}>
            <FormLabel>{t('currency')}</FormLabel>
            <CurrencySelect
              id="currency"
              value={form.values.currency}
              onSelect={(currency) =>
                form.handleChange({
                  target: {
                    id: 'currency',
                    value: currency,
                  },
                })
              }
            />
            <FormErrorMessage>{form.errors.currency}</FormErrorMessage>
          </FormControl>

          <FormControl id="name" isInvalid={Boolean(form.errors.name && form.touched.name)}>
            <FormLabel>{t('name')}</FormLabel>
            <Input type="text" onChange={form.handleChange} value={form.values.name} />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>

          <Button mt={4} colorScheme="blue" type="submit" disabled={form.isSubmitting} isLoading={form.isSubmitting}>
            {t('submit')}
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default ListForm
