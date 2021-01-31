import React, { FC } from 'react'
import { AirplaneIcon, Heading, Icon, Pane, Text } from 'evergreen-ui'
import * as types from '../types'

const SubscriptionItem: FC<types.Subscription> = (item) => {
  return (
    <Pane elevation={1} padding={24} display="flex" flexDirection="column">
      <Icon icon={AirplaneIcon} />
      <Heading size={600}>{item.name}</Heading>
      <Text>R$ 100,00</Text>
      <Text>5 days</Text>
    </Pane>
  )
}

export default SubscriptionItem
