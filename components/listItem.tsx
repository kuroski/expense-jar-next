import * as RD from '@/lib/remoteData'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

import { Box, Flex, Text } from '@chakra-ui/layout'
import React, { useState } from 'react'
import { flow, pipe } from 'fp-ts/lib/function'

import { DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/button'
import Link from 'next/link'
import { List } from '@/lib/list/codable'
import useTranslation from 'next-translate/useTranslation'

type ListItemProps = {
  list: List
  onDelete: (id: string) => TE.TaskEither<Error, unknown>
}

const ListItem = (props: ListItemProps): JSX.Element => {
  const [isDeleting, setIsDeleting] = useState<RD.RemoteData<Error, unknown>>(RD.notAsked)
  const { t } = useTranslation('common')

  function onDelete() {
    setIsDeleting(RD.pending)
    return pipe(
      props.list.id,
      props.onDelete,
      TE.fold<Error, unknown, RD.RemoteData<Error, never> | RD.RemoteData<never, unknown>>(
        flow(RD.failure, T.of),
        flow(RD.success, T.of),
      ),
      T.map(setIsDeleting),
    )()
  }

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
          color: 'blue.400',
        }}
      >
        <Link href={`lists/${props.list.urlId}`}>
          <a>
            <Text fontWeight="semibold">{props.list.name}</Text>
            <Text fontSize="sm">{props.list.currency}</Text>
          </a>
        </Link>
      </Box>

      <IconButton
        aria-label={t('delete_subscription', { name: props.list.name })}
        colorScheme="red"
        variant="outline"
        size="sm"
        height="auto"
        borderLeftRadius="0"
        icon={<DeleteIcon />}
        onClick={onDelete}
        isLoading={RD.isPending(isDeleting)}
        isDisabled={RD.isPending(isDeleting)}
      />
    </Flex>
  )
}

export default ListItem
