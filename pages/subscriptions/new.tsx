import React from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { MdBugReport, MdSettings } from 'react-icons/md'
import { format } from 'date-fns'
import { FormValues, PeriodKeys, save } from '@/services/subscriptions'

const SubscriptionSchema = Yup.object().shape({
  color: Yup.string().required("The 'color' field is required"),
  cycleAmount: Yup.number().required("The 'cycle amount' field is required"),
  cyclePeriod: Yup.string().required("The 'cycle period' field is required"),
  icon: Yup.string().required("The 'icon' field is required"),
  name: Yup.string().required("The 'name' field is required"),
  price: Yup.number().required("The 'price' field is required"),
  firstBill: Yup.date().required("The 'date' field is required"),
})

const NewSubscription = () => {
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    color: '#000000',
    cycleAmount: 1,
    cyclePeriod: 'month',
    overview: '',
    price: 0,
    firstBill: new Date(),
    icon: '',
  }

  const form = useFormik({
    initialValues,
    validationSchema: SubscriptionSchema,
    onSubmit: (values, actions) => {
      console.log({ values, actions })
      save(values)
        .then(
          () => router.push('/'),
          (error) => console.error(error),
        )
        .catch((error) => console.error(error))
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

        <FormControl id="cyclePeriod" isInvalid={Boolean(form.errors.cyclePeriod && form.touched.cyclePeriod)}>
          <FormLabel>cyclePeriod</FormLabel>
          <RadioGroup
            onChange={(value) =>
              form.handleChange({
                target: {
                  id: 'cyclePeriod',
                  value,
                },
              })
            }
            value={form.values.cyclePeriod}
          >
            <Stack direction="row">
              {PeriodKeys.map((period) => (
                <Radio key={period} value={period}>
                  {period}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <FormErrorMessage>{form.errors.cyclePeriod}</FormErrorMessage>
        </FormControl>

        <FormControl id="overview" isInvalid={Boolean(form.errors.overview && form.touched.overview)}>
          <FormLabel>overview</FormLabel>
          <Textarea onChange={form.handleChange} value={form.values.overview} />
          <FormErrorMessage>{form.errors.overview}</FormErrorMessage>
        </FormControl>

        <FormControl id="price" isInvalid={Boolean(form.errors.price && form.touched.price)}>
          <FormLabel>price</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
              €
            </InputLeftElement>
            <Input onChange={form.handleChange} value={form.values.price} placeholder="price" />
          </InputGroup>
          <FormErrorMessage>{form.errors.price}</FormErrorMessage>
        </FormControl>

        <FormControl id="firstBill" isInvalid={Boolean(form.errors.firstBill && form.touched.firstBill)}>
          <FormLabel>firstBill</FormLabel>
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

        <FormControl id="icon" isInvalid={Boolean(form.errors.icon && form.touched.icon)}>
          <FormLabel>icon</FormLabel>
          <RadioGroup
            onChange={(value) =>
              form.handleChange({
                target: {
                  id: 'icon',
                  value,
                },
              })
            }
            value={form.values.icon}
          >
            <Stack direction="row">
              <Radio value="MdSettings">
                <Icon as={MdSettings} />
              </Radio>
              <Radio value="MdBugReport">
                <Icon as={MdBugReport} />
              </Radio>
            </Stack>
          </RadioGroup>
          <FormErrorMessage>{form.errors.icon}</FormErrorMessage>
        </FormControl>

        <Button mt={4} colorScheme="teal" isLoading={form.isSubmitting} type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  )
}

export default NewSubscription
