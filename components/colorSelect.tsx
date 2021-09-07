import { Button, Menu, MenuButton, MenuItem, MenuList, SimpleGrid } from '@chakra-ui/react'

import React from 'react'

type ColorSelectProps = {
  id: string
  value: string
  onSelect: (color: string) => void
}

const ColorSelect = (props: ColorSelectProps): JSX.Element => {
  const colors = ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink']

  return (
    <Menu boundary="clippingParents">
      <MenuButton
        as={Button}
        rounded="full"
        size="sm"
        border="1px"
        borderColor="gray.500"
        bgColor={`${props.value}.500`}
        _hover={{
          bgColor: `${props.value}.600`,
        }}
      />
      <MenuList minWidth="6" px="1">
        <SimpleGrid spacing="2" columns={5}>
          {colors.map((color) => (
            <MenuItem
              onClick={() => props.onSelect(color)}
              width="6"
              height="6"
              key={color}
              value={color}
              rounded="md"
              bgColor={`${color}.500`}
              border="1px"
              borderColor={props.value === color ? 'gray.300' : `${color}.500`}
              _hover={{
                bgColor: `${color}.600`,
              }}
            />
          ))}
        </SimpleGrid>
      </MenuList>
    </Menu>
  )
}

export default ColorSelect
