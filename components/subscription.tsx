import { Box, Flex, Heading, Icon, IconButton, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'
import { CgMail } from 'react-icons/cg'
import type * as types from '@/framework/subscriptions/types'
import * as simpleIcons from 'react-icons/si'
import { DeleteIcon } from '@chakra-ui/icons'
import useNextBilling from '@/framework/subscriptions/useNextBilling'

type SubscriptionItemProps = types.Subscription & {
  onDelete: (id: string) => void
}

const SubscriptionItem = (item: SubscriptionItemProps): JSX.Element => {
  const [, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.price)
  const { formattedFirstBilling, formattedCurrentBilling, timeUntilNextBilling } = useNextBilling(item)

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
          onClick={() => item.onDelete(item._id)}
        />
      </Stat>
    </Box>
  )
}

export default SubscriptionItem
