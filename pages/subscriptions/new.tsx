import React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from '@chakra-ui/react'
import { Field, FieldProps, Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'

const SubscriptionSchema = Yup.object().shape({
  color: Yup.string().required("The 'color' field is required"),
  cycleAmount: Yup.number().required("The 'cycle amount' field is required"),
  // cyclePeriod: Yup.string().required("The 'cycle period' field is required"),
  // icon: Yup.string().required("The 'icon' field is required"),
  name: Yup.string().required("The 'name' field is required"),
  // price: Yup.number().required("The 'price' field is required"),
  // firstBill: Yup.date().required("The 'date' field is required"),
})

type FormValues = {
  name: string
  color: string
  cycleAmount: number
}

const NewSubscription = () => {
  const router = useRouter()

  const saveSubscription = async (values: FormValues) => {
    console.log(values)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { data } = await res.json()
    console.log(data)
    router.push('/')
  }

  const form = useFormik({
    initialValues: {
      name: '',
      color: '#000000',
      cycleAmount: 1,
    },
    validationSchema: SubscriptionSchema,
    onSubmit: (values, actions) => {
      console.log({ values, actions })
      saveSubscription(values)
    },
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <Stack spacing={4}>
        <FormControl id="name" isInvalid={Boolean(form.errors.name && form.touched.name)}>
          <FormLabel>Name</FormLabel>
          <Input type="text" onChange={form.handleChange} value={form.values.name} />
          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl id="color" isInvalid={Boolean(form.errors.color && form.touched.color)}>
          <FormLabel>color</FormLabel>
          <Input variant="flushed" type="color" onChange={form.handleChange} value={form.values.color} />
          <FormErrorMessage>{form.errors.color}</FormErrorMessage>
        </FormControl>

        <FormControl id="cycleAmount" isInvalid={Boolean(form.errors.cycleAmount && form.touched.cycleAmount)}>
          <FormLabel>cycleAmount</FormLabel>
          <NumberInput
            min={1}
            max={31}
            onChange={(value) =>
              form.handleChange({
                target: {
                  id: 'cycleAmount',
                  value,
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

        <pre>{JSON.stringify(form.errors)}</pre>
        <Button mt={4} colorScheme="teal" isLoading={form.isSubmitting} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  )
}

export default NewSubscription
