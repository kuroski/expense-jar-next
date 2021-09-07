import * as T from 'fp-ts/lib/Task'
import * as Yup from 'yup'

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
} from '@chakra-ui/react'

import ColorSelect from '@/components/colorSelect'
import type { FormikHelpers } from 'formik'
import Head from 'next/head'
import IconSelect from '@/components/iconSelect'
import { Period } from '@/lib/subscription/codable'
import React from 'react'
import { SubscriptionFormValues } from '@/lib/subscription/codable'
import type { Translate } from 'next-translate'
import { format } from 'date-fns'
import { useFormik } from 'formik'
import useTranslation from 'next-translate/useTranslation'

const SubscriptionSchema = (t: Translate) =>
  Yup.object().shape({
    color: Yup.string().required(t('required_field', { field: 'color' })),
    cycleAmount: Yup.number().required(t('required_field', { field: 'cycle amount' })),
    cyclePeriod: Yup.string().required(t('required_field', { field: 'cycle period' })),
    icon: Yup.string().required(t('required_field', { field: 'icon' })),
    name: Yup.string().required(t('required_field', { field: 'name' })),
    price: Yup.number().required(t('required_field', { field: 'price' })),
    firstBill: Yup.date().required(t('required_field', { field: 'date' })),
  })

export type SubscriptionForm = {
  title: string
  initialValues: SubscriptionFormValues
  onSubmit: (
    values: SubscriptionFormValues,
    formikHelpers: FormikHelpers<SubscriptionFormValues>,
  ) => T.Task<Promise<boolean>>
}

const SubscriptionForm = (props: SubscriptionForm): JSX.Element => {
  const { t } = useTranslation('common')
  const form = useFormik({
    initialValues: props.initialValues,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    validationSchema: React.useMemo(() => SubscriptionSchema(t), []),
    onSubmit: (values, formikHelpers) => props.onSubmit(values, formikHelpers)(),
  })

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <form onSubmit={form.handleSubmit}>
        <Stack spacing={4}>
          <Flex alignItems="center" gridGap="6">
            <FormControl width="auto" id="color" isInvalid={Boolean(form.errors.color && form.touched.color)}>
              <ColorSelect
                id="icon"
                value={form.values.color}
                onSelect={(value) =>
                  form.handleChange({
                    target: {
                      id: 'color',
                      value,
                    },
                  })
                }
              />
              <FormErrorMessage>{form.errors.color}</FormErrorMessage>
            </FormControl>

            <FormControl width="auto" id="icon" isInvalid={Boolean(form.errors.icon && form.touched.icon)}>
              <IconSelect
                id="icon"
                value={form.values.icon}
                onSelect={(value) =>
                  form.handleChange({
                    target: {
                      id: 'icon',
                      value,
                    },
                  })
                }
              />
              <FormErrorMessage>{form.errors.icon}</FormErrorMessage>
            </FormControl>
          </Flex>

          <FormControl id="name" isInvalid={Boolean(form.errors.name && form.touched.name)}>
            <FormLabel>{t('name')}</FormLabel>
            <Input type="text" onChange={form.handleChange} value={form.values.name} />
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={[1, 2]} spacing={4}>
            <FormControl id="firstBill" isInvalid={Boolean(form.errors.firstBill && form.touched.firstBill)}>
              <FormLabel>{t('first_bill')}</FormLabel>
              <Input
                type="date"
                onChange={(value) => {
                  form.handleChange({
                    target: {
                      id: 'firstBill',
                      value: new Date(value.target.value),
                    },
                  })
                }}
                value={format(form.values.firstBill, 'yyyy-MM-dd')}
              />
              <FormErrorMessage>{form.errors.firstBill}</FormErrorMessage>
            </FormControl>

            <FormControl id="price" isInvalid={Boolean(form.errors.price && form.touched.price)}>
              <FormLabel>{t('price')}</FormLabel>
              <NumberInput
                onChange={(value) =>
                  form.handleChange({
                    target: {
                      id: 'price',
                      value,
                    },
                  })
                }
                value={form.values.price}
                inputMode="decimal"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{form.errors.price}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={[1, 2]} spacing={4}>
            <FormControl id="cycleAmount" isInvalid={Boolean(form.errors.cycleAmount && form.touched.cycleAmount)}>
              <FormLabel aria-label={t('cycle_amount')}>{t('every_amount')}</FormLabel>
              <NumberInput
                min={1}
                max={31}
                onChange={(value) =>
                  form.handleChange({
                    target: {
                      id: 'cycleAmount',
                      value: Number(value),
                    },
                  })
                }
                value={form.values.cycleAmount}
                allowMouseWheel
                inputMode="numeric"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{form.errors.cycleAmount}</FormErrorMessage>
            </FormControl>

            <FormControl id="cyclePeriod" isInvalid={Boolean(form.errors.cyclePeriod && form.touched.cyclePeriod)}>
              <FormLabel aria-label={t('cycle_period')}>{t('cycle_period')}</FormLabel>
              <Select onChange={form.handleChange} value={form.values.cyclePeriod} placeholder={t('price')}>
                {Object.keys(Period.keys).map((period) => (
                  <option key={period} value={period}>
                    {t(period)}(s)
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{form.errors.cyclePeriod}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl id="overview" isInvalid={Boolean(form.errors.overview && form.touched.overview)}>
            <FormLabel>{t('overview')}</FormLabel>
            <Textarea onChange={form.handleChange} value={form.values.overview} />
            <FormErrorMessage>{form.errors.overview}</FormErrorMessage>
          </FormControl>

          <Button mt={4} colorScheme="teal" type="submit" disabled={form.isSubmitting} isLoading={form.isSubmitting}>
            {t('submit')}
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default SubscriptionForm
