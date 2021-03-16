import { Box, Flex, Heading, Icon, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'
import { CgMail } from 'react-icons/cg'
import type * as types from '@/framework/subscriptions/types'
import * as simpleIcons from 'react-icons/si'
import * as fns from 'date-fns/fp'
import { flow, pipe } from 'fp-ts/lib/function'

const now = new Date()
console.log(now.toISOString())
const SubscriptionItem = (item: types.Subscription) => {
  const [_, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.price)

  const currentBilling = flow((firstBill: Date) => {
    switch (item.cyclePeriod) {
      case 'day':
        return firstBill

      case 'month':
        return firstBill

      case 'week':
        return firstBill

      case 'year':
        const years = fns.differenceInYears(firstBill, now)
        const mod = years % item.cycleAmount

        if (!mod && fns.isEqual(now, fns.setYear(fns.getYear(now), firstBill))) {
          return now
        }

        const nextBill = fns.add({ years: years + (item.cycleAmount - mod) }, firstBill)
        return fns.isAfter(nextBill, now) ? fns.addYears(item.cycleAmount, nextBill) : nextBill
    }
  })(item.firstBill)

  console.table({ name: item.name, currentBilling })

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
        <StatHelpText>First: {fns.format('PP', item.firstBill)}</StatHelpText>
        <StatHelpText>Next: {fns.format('PP', currentBilling)}</StatHelpText>
        <StatHelpText>in {fns.formatDistance(currentBilling, now)}</StatHelpText>
      </Stat>
    </Box>
  )
}

export default SubscriptionItem
