import React from 'react'
import { signOut } from 'next-auth/client'
import { Avatar, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { CgLogOut } from 'react-icons/cg'
import type { User as UserNextAuth } from 'next-auth'

type Props = {
  user: UserNextAuth
}

const User = ({ user }: Props): JSX.Element => {
  const UserAvatar = <Avatar size="sm" name={user.name || 'You'} src={user.image ?? ''} />

  return (
    <Menu>
      <MenuButton as={IconButton} icon={UserAvatar} />
      <MenuList>
        <MenuItem icon={<CgLogOut />} onClick={() => signOut()}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default User
