import 'reflect-metadata'
import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import { Pane, Button } from 'evergreen-ui'
import Header from '../components/header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Pane maxWidth={600} marginX="auto" paddingX={3} padding={4}>
        <Header />
        <Pane>
          {/* Below you can see the marginRight property on a Button. */}
          <Button marginRight={16}>Button</Button>
          <Button appearance="primary">Primary Button</Button>
        </Pane>

        <Component {...pageProps} />
      </Pane>
    </Provider>
  )
}
