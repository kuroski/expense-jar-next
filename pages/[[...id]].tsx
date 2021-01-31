import React, { FC, useState } from 'react'
import { Button, Pane, TextInput, Heading, Text, Icon, AirplaneIcon } from 'evergreen-ui'
import { getSession } from 'next-auth/client'
import { Subscription, UserSession } from '../types'
import { connectToDB, subscription } from '../db'

const SubscriptionItem: FC<Subscription> = (item) => {
  return (
    <Pane
      elevation={1}
      float="left"
      width={200}
      height={120}
      margin={24}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Icon icon={AirplaneIcon} />
      <Heading size={600}>{item.name}</Heading>
      <Text>R$ 100,00</Text>
      <Text>5 days</Text>
    </Pane>
  )
}

const App: FC<{ subscriptions: Subscription[] }> = ({ subscriptions }) => {
  // hooks
  const [name, setName] = useState('')
  const [allSubscriptions, setSubscriptions] = useState(subscriptions || [])

  const saveSubscription = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/subscription/`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { data } = await res.json()
    setSubscriptions((state) => [...state, data])
  }

  return (
    <div>
      <div>
        <TextInput
          name="text-input-name"
          placeholder="Text input placeholder..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={saveSubscription}>Save</Button>
      </div>
      {allSubscriptions.map((element) => SubscriptionItem(element))}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session: { user: UserSession } = await getSession(context)
  // not signed in
  if (!session || !session.user) {
    return { props: {} }
  }

  const props: any = { session }
  const { db } = await connectToDB()
  const subscriptions = await subscription.getSubscriptions(db, session.user.id)
  props.subscriptions = subscriptions

  return {
    props,
  }
}

export default App
