import { Box, Flex, Heading, Icon, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'
import { CgMail } from 'react-icons/cg'
import type * as types from '@/framework/subscriptions/types'
import * as simpleIcons from 'react-icons/si'
import * as fns from 'date-fns/fp'
import { not, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

const now = new Date()
const setCurrentYear = fns.setYear(fns.getYear(now))
const setCurrentMonth = fns.setMonth(fns.getMonth(now))
const setCurrentWeek = fns.setWeek(fns.getWeek(now))
const isEqualNow = fns.isEqual(now)
const isBeforeNow = fns.isBefore(now)

const SubscriptionItem = (item: types.Subscription) => {
  const [_, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.price)

  const currentBilling = pipe(item.firstBill, (firstBill: Date) => {
    switch (item.cyclePeriod) {
      case 'day':
        return firstBill

      case 'week': {
        const isNextBillToday = (mod: boolean) => (firstBill: Date): boolean =>
          !mod && pipe(firstBill, setCurrentYear, setCurrentWeek, isEqualNow)
        const differenceInWeeks = fns.differenceInWeeks(firstBill, now)
        const mod = differenceInWeeks % item.cycleAmount

        return pipe(
          firstBill,
          O.fromPredicate(pipe(Boolean(mod), isNextBillToday, not)),
          O.map(fns.add({ weeks: differenceInWeeks + (item.cycleAmount - mod) })),
          O.chain((nextBill) =>
            pipe(
              nextBill,
              O.fromPredicate(isBeforeNow),
              O.map(fns.addWeeks(item.cycleAmount)),
              O.altW<Date>(() => O.some(nextBill)),
            ),
          ),
          O.getOrElse(() => now),
        )
      }

      case 'month': {
        const isNextBillToday = (mod: boolean) => (firstBill: Date): boolean =>
          !mod && pipe(firstBill, setCurrentYear, setCurrentMonth, isEqualNow)
        const differenceInMonths = fns.differenceInMonths(firstBill, now)
        const mod = differenceInMonths % item.cycleAmount

        return pipe(
          firstBill,
          O.fromPredicate(pipe(Boolean(mod), isNextBillToday, not)),
          O.map(fns.add({ months: differenceInMonths + (item.cycleAmount - mod) })),
          O.chain((nextBill) =>
            pipe(
              nextBill,
              O.fromPredicate(isBeforeNow),
              O.map(fns.addMonths(item.cycleAmount)),
              O.altW<Date>(() => O.some(nextBill)),
            ),
          ),
          O.getOrElse(() => now),
        )
      }

      case 'year': {
        const isNextBillToday = (mod: boolean) => (firstBill: Date): boolean =>
          !mod && pipe(firstBill, setCurrentYear, isEqualNow)
        const differenceInYears = fns.differenceInYears(firstBill, now)
        const mod = differenceInYears % item.cycleAmount

        return pipe(
          firstBill,
          O.fromPredicate(pipe(Boolean(mod), isNextBillToday, not)),
          O.map(fns.add({ years: differenceInYears + (item.cycleAmount - mod) })),
          O.chain((nextBill) =>
            pipe(
              nextBill,
              O.fromPredicate(isBeforeNow),
              O.map(fns.addYears(item.cycleAmount)),
              O.altW<Date>(() => O.some(nextBill)),
            ),
          ),
          O.getOrElse(() => now),
        )
      }
    }
  })

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
