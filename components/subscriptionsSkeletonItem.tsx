import { Box, Skeleton } from '@chakra-ui/react'
import React from 'react'

const SubscriptionsSkeletonItem = () => {
  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      <Skeleton height={3} />
      <Skeleton mt="6" height={2} />
      <Skeleton height={5} my={3} />
      <Skeleton height={2} />
    </Box>
  )
}

export default SubscriptionsSkeletonItem
