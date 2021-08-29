import '@/styles/globals.css'
import 'reflect-metadata'
import React from 'react'
import type { AppProps } from 'next/app'
import { Provider, useSession } from 'next-auth/client'
import { Box, Center, ChakraProvider, Spinner } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Header from '@/components/header'

const Content = ({ Component, pageProps }: AppProps) => {
  const [, loading] = useSession()

  if (loading)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  return <Component {...pageProps} />
}

export default function App(props: AppProps): JSX.Element {
  return (
    <Provider session={props.pageProps.session}>
      <ChakraProvider>
        <motion.div key={props.router.route} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Box p={4}>
            <Header />
            <Content {...props} />
          </Box>
        </motion.div>
      </ChakraProvider>
    </Provider>
  )
}
