import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
import * as icons from 'react-icons/md'
import { flow } from 'fp-ts/lib/function'
import { key } from 'monocle-ts/lib/Traversal'
import { useDebounce } from 'use-debounce/lib'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

type Props = {
  onSelect: (icon: string) => void
}
const IconSelect = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm] = useDebounce(searchTerm, 500)

  const iconList = useMemo(
    () =>
      Object.entries(icons).map(([key, i]) => {
        const isSelected = key.toLowerCase().includes(debouncedTerm.toLowerCase())
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isSelected ? 1 : 0.3 }}
            exit={{ opacity: 0 }}
          >
            <IconButton
              key={key}
              aria-label={key}
              icon={<Icon as={i} />}
              onClick={flow(() => props.onSelect(key), onClose)}
            />
          </motion.div>
        )
      }),
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
            <AnimatePresence>
              <SimpleGrid columns={7} gap={4}>
                {iconList}
              </SimpleGrid>
            </AnimatePresence>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelect
