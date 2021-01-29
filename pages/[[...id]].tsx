import React, { FC, useState } from 'react'
import { Dialog } from 'evergreen-ui'
import { useSession, signIn, getSession } from 'next-auth/client'
import { UserSession } from '../types'
import { connectToDB, subscription } from '../db'

const App: FC<{ subscriptions?: any[] }> = ({ subscriptions }) => {
  // hooks
  const [session, loading] = useSession()

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
      <div>{JSON.stringify(subscriptions)}</div>
      <div>Hello world!</div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session: { user: UserSession } = await getSession(context)
  console.log(session)
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
