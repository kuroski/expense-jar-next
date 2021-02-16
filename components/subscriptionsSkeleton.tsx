/* eslint-disable react/no-array-index-key */
import React from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import SubscriptionsSkeletonItem from './subscriptionsSkeletonItem'

const SubscriptionsSkeleton = () => {
  const subscriptions = [...new Array(6)]

  return (
    <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
      {subscriptions?.map((_, index) => (
        <SubscriptionsSkeletonItem key={index} />
      ))}
    </SimpleGrid>
  )
}
export default SubscriptionsSkeleton
