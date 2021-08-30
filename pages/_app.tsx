import '@/styles/globals.css'
import 'reflect-metadata'

import { Box, Center, ChakraProvider, Spinner } from '@chakra-ui/react'
import { Provider, useSession } from 'next-auth/client'

import type { AppProps } from 'next/app'
import Header from '@/components/header'
import React from 'react'
import { motion } from 'framer-motion'

const Content = ({ Component, pageProps }: AppProps) => {
  const [, loading] = useSession()

  if (loading)
    return (
      <Center>
        <Spinner />
      </Center>
    )

  return (
    <Box mt="6">
      <Component {...pageProps} />
    </Box>
  )
}

export default function App(props: AppProps): JSX.Element {
  return (
    <Provider session={props.pageProps.session}>
      <ChakraProvider>
        <motion.div key={props.router.route} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Box p={4} maxW="2xl" mx="auto">
            <Header />
            <Content {...props} />
          </Box>
        </motion.div>
      </ChakraProvider>
    </Provider>
  )
}
