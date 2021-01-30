import React, { FC } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/client'
import { Pane } from 'evergreen-ui'
import User from './user'

const handleLogin = (e) => {
  e.preventDefault()
  signIn('github')
}

const Header: FC = () => {
  const [session] = useSession()

  // const handleLogout = (e) => {
  //   e.preventDefault()
  //   signOut()
  // }

  return (
    <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
      <Link href="/">
        <a className="title">Home</a>
      </Link>
      <div className="user-info">
        {session ? (
          <User user={session.user} />
        ) : (
          <a href="#" onClick={handleLogin} className="logout">
            Login
          </a>
        )}
      </div>
    </Pane>
  )
}

export default Header
