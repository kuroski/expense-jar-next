import { Button, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { CgHome, CgLogIn } from 'react-icons/cg'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { signIn, useSession } from 'next-auth/client'

import Link from 'next/link'
import React from 'react'
import User from '@/components/user'
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

      {session?.user ? (
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
