import { Box, Flex, Text } from '@chakra-ui/layout'

import { Button } from '@chakra-ui/button'
import { DeleteIcon } from '@chakra-ui/icons'
import Icon from '@chakra-ui/icon'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import React from 'react'

type ListItemProps = {
  list: List
}

const ListItem = (props: ListItemProps): JSX.Element => {
  return (
    <Flex>
      <Box
        flex="1"
        p="4"
        border="1px"
        borderColor="gray.700"
        roundedLeft="md"
        _hover={{
          background: 'gray.700',
          color: 'teal.500',
        }}
      >
        <Link href={`lists/${props.list.urlId}`}>
          <a>
            <Text fontWeight="semibold">{props.list.name}</Text>
            <Text fontSize="sm">{props.list.currency}</Text>
          </a>
        </Link>
      </Box>

      <Button colorScheme="red" size="sm" height="auto" borderLeftRadius="0" variant="outline">
        <Icon as={DeleteIcon} />
      </Button>
    </Flex>
  )
}

export default ListItem
