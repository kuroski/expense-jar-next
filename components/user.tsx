import React from 'react'
import { signOut } from 'next-auth/client'
import { Avatar, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { CgLogOut } from 'react-icons/cg'
import type { User as UserNextAuth } from 'next-auth'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  user: UserNextAuth
}

const User = ({ user }: Props): JSX.Element => {
  const { t } = useTranslation('common')
  const UserAvatar = <Avatar size="sm" name={user.name || 'You'} src={user.image ?? ''} />

  return (
    <Menu>
      <MenuButton as={IconButton} icon={UserAvatar} />
      <MenuList>
        <MenuItem icon={<CgLogOut />} onClick={() => signOut()}>
          {t('logout')}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default User
