import React, { FC } from 'react'
import { Dialog } from 'evergreen-ui'
import { useSession, signIn } from 'next-auth/client'

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

export default App
