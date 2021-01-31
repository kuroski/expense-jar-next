import React, { FC, useState } from 'react'
import { IconButton, Pane, AddIcon } from 'evergreen-ui'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import * as types from '../types'
import { connectToDB, subscription } from '../db'
import Subscription from '../components/subscription'

const App: FC<{ subscriptions: types.Subscription[] }> = ({ subscriptions }) => {
  const [allSubscriptions] = useState(subscriptions || [])

  return (
    <Pane marginTop={4}>
      <Pane display="flex" justifyContent="flex-end">
        <Link href="/subscriptions/new">
          <a>
            <IconButton appearance="minimal" icon={AddIcon} />
          </a>
        </Link>
      </Pane>

      <Pane display="grid" gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap="1rem">
        {allSubscriptions.map((element) => (
          <Subscription {...element} key={element.name} />
        ))}
      </Pane>
    </Pane>
  )
}

export async function getServerSideProps(context) {
  const session: { user: types.UserSession } = await getSession(context)
  // not signed in
  if (!session || !session.user) {
    return { props: {} }
  }

  const props: any = { session }
  const { db } = await connectToDB()
  const subscriptions = await subscription.getSubscriptions(db, session.user.id)
  props.subscriptions = subscriptions

  return {
    props,
  }
}

export default App
