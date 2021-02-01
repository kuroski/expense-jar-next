import '../styles/globals.css'
import 'reflect-metadata'
import React, { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider, useSession, signIn } from 'next-auth/client'
import {
  Button,
  Center,
  ChakraProvider,
  Container,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from '@chakra-ui/react'
import Header from '../components/header'

const Content: FC<AppProps> = ({ Component, pageProps }) => {
  const [session, loading] = useSession()

  if (!session && !loading) {
    return (
      <Modal isOpen isCentered onClose={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session expired</ModalHeader>
          <ModalBody>Sign in to continue</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => signIn('github')}>
              Sign in to continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }

  return <Component {...pageProps} />
}

export default function App(props: AppProps) {
  return (
    <Provider session={props.pageProps.session}>
      <ChakraProvider>
        <Container py={4}>
          <Header />
          <Content {...props} />
        </Container>
      </ChakraProvider>
    </Provider>
  )
}
