import { FormValues } from '@/pages/subscriptions/new'

export async function save(values: FormValues) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { data } = await response.json()
  return data
}

export async function all() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { subscriptions } = await response.json()
  return subscriptions
}
