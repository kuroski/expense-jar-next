import 'reflect-metadata'
import React, { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider, useSession, signIn } from 'next-auth/client'
import { Pane, Spinner, Dialog } from 'evergreen-ui'
import Header from '../components/header'

const Content: FC<AppProps> = ({ Component, pageProps }) => {
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

  if (loading) {
    return (
      <Pane display="flex" alignItems="center" justifyContent="center" height={400}>
        <Spinner />
      </Pane>
    )
  }

  return <Component {...pageProps} />
}

export default function App(props: AppProps) {
  return (
    <Provider session={props.pageProps.session}>
      <Pane maxWidth={600} marginX="auto" paddingX={3} padding={4}>
        <Header />

        <Content {...props} />
      </Pane>
    </Provider>
  )
}
