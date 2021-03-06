import React, { useMemo, useState } from 'react'
import {
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
import * as materialIcons from 'react-icons/md'
import { flow } from 'fp-ts/lib/function'
import { useDebounce } from 'use-debounce/lib'

type Props = {
  onSelect: (icon: string) => void
}

const IconSelect = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm] = useDebounce(searchTerm, 500)

  const icons = useMemo(
    () =>
      Object.entries(materialIcons).map(([key, icon]) => [
        key.toLowerCase(),
        <IconButton
          key={key}
          aria-label={key}
          icon={<Icon as={icon} />}
          onClick={flow(() => props.onSelect(key), onClose)}
        />,
      ]),
    [],
  )

  const iconList = useMemo(
    () => icons.filter(([name]) => String(name).includes(debouncedTerm.toLowerCase())).map(([_, component]) => component),
    [debouncedTerm],
  )

  return (
    <>
      <Button onClick={onOpen}>Select an icon</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Input
              placeholder="Search for an icon"
              autoFocus={true}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </ModalHeader>
          <ModalBody pb={6}>
            <SimpleGrid columns={7} gap={4}>
              {iconList}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelect
