import { Box, Flex, Heading, Icon, IconButton, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React, { useState } from 'react'
import { CgMail } from 'react-icons/cg'
import type * as types from '@/framework/subscriptions/types'
import * as simpleIcons from 'react-icons/si'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import useNextBilling from '@/framework/subscriptions/useNextBilling'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import * as RD from '@/framework/remoteData'
import Link from 'next/link'

type SubscriptionItemProps = types.Subscription & {
  onDelete: (id: string) => TE.TaskEither<Error, unknown>
}

const SubscriptionItem = (item: SubscriptionItemProps): JSX.Element => {
  const [isDeleting, setIsDeleting] = useState<RD.RemoteData<Error, unknown>>(RD.notAsked)
  const [, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.price)
  const { formattedFirstBilling, formattedCurrentBilling, timeUntilNextBilling } = useNextBilling(item)

  function onDelete() {
    setIsDeleting(RD.pending)
    return pipe(
      item._id,
      item.onDelete,
      TE.fold(
        (e) => {
          setIsDeleting(RD.failure(e))
          return T.never
        },
        () => T.never,
      ),
    )()
  }

  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      <Flex align="center" justify={['center', 'flex-start']}>
        <Icon mr={2} width="18px" as={icon || CgMail} />
        <Heading as="h3" size="md">
          {item.name}
        </Heading>
      </Flex>

      <Stat mt={4}>
        <StatLabel>
          <span>
            Every <strong>{item.cycleAmount}</strong> {item.cyclePeriod}
          </span>
        </StatLabel>
        <StatNumber>{price}</StatNumber>
        <StatHelpText>First: {formattedFirstBilling}</StatHelpText>
        <StatHelpText>Next: {formattedCurrentBilling}</StatHelpText>
        <StatHelpText>in {timeUntilNextBilling}</StatHelpText>
        <IconButton
          aria-label={`Delete subscription: ${item.name}`}
          colorScheme="red"
          variant="outline"
          size="sm"
          icon={<DeleteIcon />}
          onClick={onDelete}
          isLoading={RD.isPending(isDeleting)}
          isDisabled={RD.isPending(isDeleting)}
          mr="2"
        />
        <Link
          href={{
            pathname: '/subscriptions/[id]',
            query: { id: item._id },
          }}
        >
          <a>
            <IconButton aria-label="Edit subscription" icon={<EditIcon />} />
          </a>
        </Link>
      </Stat>
    </Box>
  )
}

export default SubscriptionItem
