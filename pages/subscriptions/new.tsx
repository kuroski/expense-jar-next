import React from 'react'
import { useRouter } from 'next/router'
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Select, useTheme } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

const SubscriptionSchema = Yup.object().shape({
  // color: Yup.string().required("The 'color' field is required"),
  // cycleAmount: Yup.number().required("The 'cycle amount' field is required"),
  // cyclePeriod: Yup.string().required("The 'cycle period' field is required"),
  // icon: Yup.string().required("The 'icon' field is required"),
  name: Yup.string().required("The 'name' field is required"),
  // price: Yup.number().required("The 'price' field is required"),
  // firstBill: Yup.date().required("The 'date' field is required"),
})

type Subscription = {
  name: string
}

const NewSubscription = () => {
  // const [name, setName] = useState('')
  const router = useRouter()
  const theme = useTheme()

  const saveSubscription = async (name = '') => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { data } = await res.json()
    console.log(data)
    router.push('/')
  }

  const initialValues: Subscription = { name: '' }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SubscriptionSchema}
      onSubmit={(values, actions) => {
        console.log({ values, actions })
        saveSubscription(values.name)
      }}
    >
      {(props) => (
        <Form>
          <Field name="name">
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.name && form.touched.name}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input {...field} id="name" placeholder="name" />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="color">
            {({ field, form }: any) => (
              <FormControl isInvalid={form.errors.color && form.touched.color}>
                <FormLabel htmlFor="color">color</FormLabel>
                <Select {...field} id="color" placeholder="color">
                  {Object.keys(theme.colors).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{form.errors.color}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <pre>{JSON.stringify(props.errors)}</pre>
          <Button mt={4} colorScheme="teal" isLoading={props.isSubmitting} type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>

    // <div>
    //   <Input
    //     name="text-input-name"
    //     placeholder="Text input placeholder..."
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //   />

    //   <Button onClick={saveSubscription}>Save</Button>
    // </div>
  )
}

export default NewSubscription
