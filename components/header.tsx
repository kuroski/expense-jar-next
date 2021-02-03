import React from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/client'
import { Button, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { CgLogIn, CgHome } from 'react-icons/cg'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import User from './user'

const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  signIn('github')
}

const Header = () => {
  const [session] = useSession()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex align="center" justify="space-between" mb={3}>
      <div>
        <IconButton
          mr={3}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
          onClick={toggleColorMode}
        />

        <Link href="/">
          <a>
            <IconButton aria-label="Home page" icon={<CgHome />} />
          </a>
        </Link>
      </div>

      {session ? (
        <User user={session.user} />
      ) : (
        <Button rightIcon={<CgLogIn />} onClick={handleLogin}>
          Login
        </Button>
      )}
    </Flex>
  )
}

export default Header
