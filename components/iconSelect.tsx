/* eslint-disable jsx-a11y/no-autofocus, react/display-name */
import React, { useState, useCallback, useEffect } from 'react'
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
import { flow, pipe } from 'fp-ts/lib/function'
import type { IconType } from 'react-icons/lib'
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import * as si from 'react-icons/si'
import * as A from 'fp-ts/Array'
import useTranslation from 'next-translate/useTranslation'

type IconSelectProps = {
  id: string
  value: string
  onSelect: (icon: string) => void
}

type SelectedProps = {
  selected?: string
  onSelect: (icon: string) => void
}

type IconListProps = SelectedProps & {
  icons: string[]
}

type IconListItemProps = SelectedProps & {
  name: string
  icon: IconType
}

type IconsCache = {
  keys: string[]
  iconButtons: {
    [key: string]: (props: SelectedProps) => JSX.Element
  }
  icons: {
    [key: string]: () => JSX.Element
  }
}

const IconListItem = (props: IconListItemProps) => (
  <IconButton
    aria-label={props.name}
    icon={<Icon as={props.icon} />}
    onClick={() => props.onSelect(props.name)}
    border="1px"
    borderColor={props.name === props.selected ? 'blue.300' : 'gray.600'}
  />
)

const {
  keys: iconKeys,
  icons,
  iconButtons,
}: IconsCache = pipe(
  Object.entries(si),
  A.reduce<[string, IconType], IconsCache>(
    {
      keys: [],
      iconButtons: {},
      icons: {},
    },
    (acc, [key, icon]) => ({
      keys: [...acc.keys, key],
      iconButtons: {
        ...acc.iconButtons,
        [key]: (props: SelectedProps) => (
          <IconListItem name={key} selected={props.selected} icon={icon} onSelect={props.onSelect} />
        ),
      },
      icons: {
        ...acc.icons,
        [key]: () => <Icon as={icon} />,
      },
    }),
  ),
)

const IconList = React.memo((props: IconListProps) => (
  <SimpleGrid columns={7} gap={4}>
    {props.icons.map((key) =>
      React.createElement<SelectedProps>(iconButtons[key], {
        onSelect: props.onSelect,
        selected: props.selected,
        key,
      }),
    )}
  </SimpleGrid>
))

const IconSelect = (props: IconSelectProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchTerm, setSearchTerm] = useState('')
  const [iconList, setIconList] = useState<string[]>([])
  const { t } = useTranslation('common')

  useEffect(() => setIconList(iconKeys), [])

  const searchButtonClicked = useCallback(
    () => setIconList(iconKeys.filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase()))),
    [searchTerm],
  )

  const iconSelected = useCallback((icon: string) => flow(props.onSelect, onClose)(icon), [onClose, props.onSelect])

  const foundIconKey = iconKeys.find((key) => key === props.value)
  const buttonContent = foundIconKey ? React.createElement(icons[foundIconKey]) : <span>Select an icon</span>

  return (
    <>
      <ButtonGroup isAttached variant="outline">
        <Button id={props.id} onClick={onOpen}>
          {buttonContent}
        </Button>
        {foundIconKey && <IconButton aria-label={t('clear')} icon={<DeleteIcon />} onClick={() => iconSelected('')} />}
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <InputGroup size="md">
              <Input
                id="icon-search"
                placeholder={t('search_icon')}
                autoFocus={true}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchButtonClicked()}
              />
              <InputRightElement>
                <IconButton aria-label={t('search')} onClick={searchButtonClicked} icon={<SearchIcon />} />
              </InputRightElement>
            </InputGroup>
          </ModalHeader>
          <ModalBody pb={6}>
            <IconList selected={props.value} icons={iconList} onSelect={iconSelected} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelect
