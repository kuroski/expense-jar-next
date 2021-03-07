import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
import * as simpleIcons from 'react-icons/si'
import { flow } from 'fp-ts/lib/function'
import type { IconType } from 'react-icons/lib'
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons'

type IconSelectProps = {
  id: string
  value: string
  onSelect: (icon: string) => void
}

type IconListProps = {
  selected?: string
  icons: IconType[]
  onSelect: (icon: string) => void
}

const icons = Object.values(simpleIcons)

const IconList = React.memo((props: IconListProps) => (
  <SimpleGrid columns={7} gap={4}>
    {props.icons.map((icon) => (
      <IconButton
        key={icon.name}
        aria-label={icon.name}
        icon={<Icon as={icon} />}
        onClick={() => props.onSelect(icon.name)}
        border="1px"
        borderColor={icon.name === props.selected ? 'blue.300' : 'gray.600'}
      />
    ))}
  </SimpleGrid>
))

const IconSelect = (props: IconSelectProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchTerm, setSearchTerm] = useState('')
  const [iconList, setIconList] = useState<IconType[]>([])

  useEffect(() => setIconList(icons), [])

  const searchButtonClicked = useCallback(
    () => setIconList(icons.filter((icon) => icon.name.toLowerCase().includes(searchTerm.toLowerCase()))),
    [searchTerm],
  )

  const iconSelected = useCallback((icon: string) => flow(props.onSelect, onClose)(icon), [])

  const foundIcon =
    props.value.trim().length > 0 ? Object.entries(simpleIcons).find(([key]) => key === props.value) : false
  const buttonContent = foundIcon ? <Icon as={foundIcon[1]} /> : <span>Select an icon</span>

  return (
    <>
      <ButtonGroup isAttached variant="outline">
        <Button id={props.id} onClick={onOpen}>
          {buttonContent}
        </Button>
        {foundIcon && <IconButton aria-label="Clear icon" icon={<DeleteIcon />} onClick={() => iconSelected('')} />}
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <InputGroup size="md">
              <Input
                id="icon-search"
                placeholder="Search for an icon"
                autoFocus={true}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchButtonClicked()}
              />
              <InputRightElement>
                <IconButton aria-label="Search icon" onClick={searchButtonClicked} icon={<SearchIcon />} />
              </InputRightElement>
            </InputGroup>
          </ModalHeader>
          <ModalBody pb={6}>
            {iconList.length <= 0 && 'No icon found'}
            <IconList selected={props.value} icons={iconList} onSelect={iconSelected} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelect
