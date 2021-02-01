import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Input } from '@chakra-ui/react'

const NewSubscription: FC = () => {
  const [name, setName] = useState('')
  const router = useRouter()

  const saveSubscription = async () => {
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

  return (
    <div>
      <Input
        name="text-input-name"
        placeholder="Text input placeholder..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Button onClick={saveSubscription}>Save</Button>
    </div>
  )
}

export default NewSubscription
