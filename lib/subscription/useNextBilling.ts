import * as O from 'fp-ts/lib/Option'
import * as fns from 'date-fns/fp'

import { Subscription } from '@/lib/subscription/codable'
import { not } from 'fp-ts/lib/Predicate'
import { pipe } from 'fp-ts/lib/function'

export type UseNextBilling = {
  formattedFirstBilling: string
  currentBilling: Date
  formattedCurrentBilling: string
  timeUntilNextBilling: string
}

const now = new Date()
const setCurrentYear = fns.setYear(fns.getYear(now))
const setCurrentMonth = fns.setMonth(fns.getMonth(now))
const setCurrentWeek = fns.setWeek(fns.getWeek(now))
const setCurrentDay = fns.setDay(fns.getDay(now))
const isEqualNow = fns.isEqual(now)
const isBeforeNow = fns.isBefore(now)

const calculateNextBilling = (item: Subscription) =>
  pipe(item.firstBill, (firstBill: Date) => {
    switch (item.cyclePeriod) {
      case 'day': {
        const isNextBillToday =
          (mod: boolean) =>
          (firstBill: Date): boolean =>
            !mod && pipe(firstBill, setCurrentYear, setCurrentMonth, setCurrentDay, isEqualNow)
        const differenceInDays = fns.differenceInDays(firstBill, now)
        const mod = differenceInDays % item.cycleAmount

        return pipe(
          firstBill,
          O.fromPredicate(pipe(Boolean(mod), isNextBillToday, not)),
          O.map(fns.add({ days: differenceInDays + (item.cycleAmount - mod) })),
          O.chain((nextBill) =>
            pipe(
              nextBill,
              O.fromPredicate(isBeforeNow),
              O.map(fns.addDays(item.cycleAmount)),
              O.altW<Date>(() => O.some(nextBill)),
            ),
          ),
          O.getOrElse(() => now),
        )
      }

      case 'week': {
        const isNextBillToday =
          (mod: boolean) =>
          (firstBill: Date): boolean =>
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
        const isNextBillToday =
          (mod: boolean) =>
          (firstBill: Date): boolean =>
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
        const isNextBillToday =
          (mod: boolean) =>
          (firstBill: Date): boolean =>
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

const useNextBilling = (item: Subscription): UseNextBilling => {
  const currentBilling = calculateNextBilling(item)
  return {
    formattedFirstBilling: fns.format('PP', item.firstBill),
    currentBilling,
    formattedCurrentBilling: fns.format('PP', currentBilling),
    timeUntilNextBilling: fns.formatDistance(currentBilling, now),
  }
}

export default useNextBilling
