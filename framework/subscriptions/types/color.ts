/* eslint-disable no-redeclare */
import * as t from 'io-ts'
import theme from '@/theme'
import { pipe } from 'fp-ts/lib/function'
import { fold, isSome, Option } from 'fp-ts/lib/Option'
import { findFirst } from 'fp-ts/lib/Array'

const colors = Object.keys(theme.colors || {})
const findColor = (color: string): Option<string> => findFirst((name: string) => name === color)(colors)

const Color = new t.Type<string, string, unknown>(
  'color',
  (input: unknown): input is string => typeof input === 'string' && isSome(findColor(input)),
  (input, context) => {
    if (typeof input !== 'string') return t.failure(input, context)
    return pipe(
      findColor(input),
      fold(
        () => t.success(input),
        () => t.failure(input, context),
      ),
    )
  },
  t.identity,
)
type Color = t.TypeOf<typeof Color>

export default Color
