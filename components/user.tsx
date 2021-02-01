import React, { FC } from 'react'
import { signOut } from 'next-auth/client'
import { Avatar, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { CgLogOut } from 'react-icons/cg'
import { UserSession } from '../types'

const User: FC<{ user: UserSession }> = ({ user }) => {
  const UserAvatar = <Avatar size="sm" src={user.image} />

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
