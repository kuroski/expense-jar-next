import React, { FC } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/client'
import { Pane, IconButton, HomeIcon, LogInIcon } from 'evergreen-ui'
import User from './user'

const handleLogin = (e) => {
  e.preventDefault()
  signIn('github')
}

const Header: FC = () => {
  const [session] = useSession()

  return (
    <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
      <Pane flex={1} display="flex">
        <Link href="/">
          <a>
            <IconButton appearance="minimal" icon={HomeIcon} />
          </a>
        </Link>
      </Pane>

      {session ? (
        <User user={session.user} />
      ) : (
        <IconButton appearance="minimal" icon={LogInIcon} onClick={handleLogin} />
      )}
    </Pane>
  )
}

export default Header
