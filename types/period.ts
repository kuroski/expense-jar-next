/* eslint-disable no-redeclare */
import * as t from 'io-ts'

const Period = t.keyof({
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
})
type Period = t.TypeOf<typeof Period>

export default Period
