/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable unicorn/no-fn-reference-in-iterator */
// eslint-disable-next-line max-classes-per-file
import { absurd, flow, pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'

type Unauthorized = {
  _tag: 'UNAUTHORIZED'
}
const unauthorized: Unauthorized = { _tag: 'UNAUTHORIZED' }

type Other = {
  _tag: 'OTHER'
  error: Error
}
const other = (error: unknown): Other => ({ _tag: 'OTHER', error: E.toError(error) })

type StatementError = Unauthorized | Other

async function getSession() {
  // return Promise.resolve({
  //   // user: 1,
  // })
  throw new Error('Fail to get session')
}

async function getSubscriptions() {
  return Promise.resolve([{ name: 'Spotify' }, { name: 'Netflix' }])
  // throw new Error('Internal server error')
}

const logIt = <A>(e: A): A => {
  console.log(e)
  return e
}

function init() {
  const bla = pipe(
    TE.tryCatch<StatementError, { user?: number } | void>(
      getSession,
      other,
      // (error) => {
      //   console.log(error)
      //   return E.toError(error)
      // },
    ),
    TE.map(logIt),
    TE.chain((session) => {
      console.log(session)
      if (session && session.user) return TE.right(session)
      // return TE.left(new Error('Unauthorized'))
      return TE.left(unauthorized)
    }),
    TE.map(logIt),
    // TE.chain(() =>
    //   TE.tryCatch(
    //     () => getSubscriptions(),
    //     (error) => {
    //       console.log(error)
    //       return other(error)
    //       // return E.toError(error)
    //     },
    //   ),
    // ),
  )()

  console.log(bla)

  bla
    .then((e) =>
      pipe(
        e,
        E.fold(
          (error) => {
            console.log(error)
            switch (error._tag) {
              case 'UNAUTHORIZED':
                console.log('User unauthorized')
                break

              case 'OTHER':
                console.log('Other kind of error')
                break
            }
          },
          (result) => {
            console.log(result)
          },
        ),
      ),
    )
    .catch((error) => {
      console.log(error)
    })

  bla
    .then((result) => {
      console.log(result)
      return result
    })
    .catch((error) => {
      console.log(error)
    })
}

init()
