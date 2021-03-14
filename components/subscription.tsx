import { Box, Flex, Heading, Icon, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'
import { CgMail } from 'react-icons/cg'
import type * as types from '@/framework/subscriptions/types'
import * as simpleIcons from 'react-icons/si'
import format from 'date-fns/fp/format'

const SubscriptionItem = (item: types.Subscription) => {
  const [_, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.price)

  const nextBilling = new Date()

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
        <StatHelpText>{format('P', item.firstBill)}</StatHelpText>
        <StatHelpText>{format('P', nextBilling)}</StatHelpText>
        {/* <StatLabel>4 weeks</StatLabel>
        <StatNumber>R$ 100,00</StatNumber>
        <StatHelpText>Feb 12 - Feb 28</StatHelpText> */}
      </Stat>
    </Box>
  )
}

export default SubscriptionItem
