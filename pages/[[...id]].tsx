import React, { FC, useState } from 'react'
import { Button, Dialog, TextInput } from 'evergreen-ui'
import { useSession, signIn, getSession } from 'next-auth/client'
import { Subscription, UserSession } from '../types'
import { connectToDB, subscription } from '../db'

const App: FC<{ subscriptions: Subscription[] }> = ({ subscriptions }) => {
  // hooks
  const [session, loading] = useSession()
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

  if (!session && !loading) {
    return (
      <Dialog
        isShown
        title="Session expired"
        confirmLabel="Ok"
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        onConfirm={() => signIn('github')}
      >
        Sign in to continue
      </Dialog>
    )
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div>{JSON.stringify(allSubscriptions)}</div>

      <div>
        <TextInput
          name="text-input-name"
          placeholder="Text input placeholder..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={saveSubscription}>Save</Button>
      </div>
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
