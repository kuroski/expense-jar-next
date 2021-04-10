import React from 'react'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
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
import { useFormik } from 'formik'
import type { FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import IconSelect from '@/components/iconSelect'
import Head from 'next/head'
import type { FormValues } from '@/framework/subscriptions/types'
import * as T from 'fp-ts/lib/Task'
import { Period } from '@/framework/subscriptions/types'

const SubscriptionSchema = Yup.object().shape({
  color: Yup.string().required("The 'color' field is required"),
  cycleAmount: Yup.number().required("The 'cycle amount' field is required"),
  cyclePeriod: Yup.string().required("The 'cycle period' field is required"),
  icon: Yup.string().required("The 'icon' field is required"),
  name: Yup.string().required("The 'name' field is required"),
  price: Yup.number().required("The 'price' field is required"),
  firstBill: Yup.date().required("The 'date' field is required"),
})

export type SubscriptionForm = {
  title: string
  initialValues: FormValues
  onSubmit: (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => T.Task<Promise<boolean>>
}

const SubscriptionForm = (props: SubscriptionForm): JSX.Element => {
  const form = useFormik({
    initialValues: props.initialValues,
    validationSchema: SubscriptionSchema,
    onSubmit: (values, formikHelpers) => props.onSubmit(values, formikHelpers)(),
  })

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <form onSubmit={form.handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="icon" isInvalid={Boolean(form.errors.icon && form.touched.icon)}>
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

          <Grid templateColumns={['1fr', 'auto 1fr']} gap={4}>
            <FormControl id="color" isInvalid={Boolean(form.errors.color && form.touched.color)}>
              <FormLabel>Color</FormLabel>
              <Input variant="flushed" type="color" onChange={form.handleChange} value={form.values.color} />
              <FormErrorMessage>{form.errors.color}</FormErrorMessage>
            </FormControl>

            <FormControl id="name" isInvalid={Boolean(form.errors.name && form.touched.name)}>
              <FormLabel>Name</FormLabel>
              <Input type="text" onChange={form.handleChange} value={form.values.name} />
              <FormErrorMessage>{form.errors.name}</FormErrorMessage>
            </FormControl>
          </Grid>

          <SimpleGrid columns={[1, 2]} spacing={4}>
            <FormControl id="firstBill" isInvalid={Boolean(form.errors.firstBill && form.touched.firstBill)}>
              <FormLabel>First bill</FormLabel>
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
              <FormLabel>Price</FormLabel>
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
              <FormLabel aria-label="Cycle amount">Every (amount)</FormLabel>
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
              <FormLabel aria-label="Cycle period">Period</FormLabel>
              <Select onChange={form.handleChange} value={form.values.cyclePeriod} placeholder="Price">
                {Object.keys(Period.keys).map((period) => (
                  <option key={period} value={period}>
                    {period}(s)
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{form.errors.cyclePeriod}</FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl id="overview" isInvalid={Boolean(form.errors.overview && form.touched.overview)}>
            <FormLabel>Overview</FormLabel>
            <Textarea onChange={form.handleChange} value={form.values.overview} />
            <FormErrorMessage>{form.errors.overview}</FormErrorMessage>
          </FormControl>

          <Button mt={4} colorScheme="teal" type="submit" disabled={form.isSubmitting} isLoading={form.isSubmitting}>
            Submit
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default SubscriptionForm