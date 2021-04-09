/* eslint-disable no-redeclare */
import * as t from 'io-ts'

const List = t.type({
  _id: t.string,
  urlId: t.union([t.string, t.undefined]),
})
type List = t.TypeOf<typeof List>

export default List
