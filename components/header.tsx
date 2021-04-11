import React from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/client'
import { Button, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { CgLogIn, CgHome } from 'react-icons/cg'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import User from './user'
import useTranslation from 'next-translate/useTranslation'

const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault()
  signIn('github')
}

const Header = (): JSX.Element => {
  const [session] = useSession()
  const { colorMode, toggleColorMode } = useColorMode()
  const { t } = useTranslation('common')

  return (
    <Flex align="center" justify="space-between" mb={3}>
      <div>
        <IconButton
          mr={3}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          aria-label={t('switch_to_mode', { mode: colorMode === 'light' ? 'dark' : 'light' })}
          onClick={toggleColorMode}
        />

        <Link href="/">
          <a>
            <IconButton aria-label={t('home_page')} icon={<CgHome />} />
          </a>
        </Link>
      </div>

      {session ? (
        <User user={session.user} />
      ) : (
        <Button rightIcon={<CgLogIn />} onClick={handleLogin}>
          {t('login')}
        </Button>
      )}
    </Flex>
  )
}

export default Header
