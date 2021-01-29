import React, { FC } from 'react'
import Link from 'next/link'
import { useSession, signIn } from 'next-auth/client'
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
    <div className="header">
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
    </div>
  )
}

export default Header
