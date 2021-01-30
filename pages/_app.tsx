import 'reflect-metadata'
import React from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import Header from '../components/header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  )
}
