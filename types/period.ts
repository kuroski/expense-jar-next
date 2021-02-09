/* eslint-disable no-redeclare */
import * as t from 'io-ts'

const Period = t.union([t.literal('day'), t.literal('week'), t.literal('month'), t.literal('year')])
type Period = t.TypeOf<typeof Period>

export default Period
