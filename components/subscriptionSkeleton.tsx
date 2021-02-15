import { Box, Flex, SkeletonText, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import React from 'react'

const SubscriptionItemSkeleton = () => {
  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      <Flex align="center" justify={['center', 'flex-start']}>
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
      </Flex>

      <Stat mt={4}>
        <StatLabel>
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </StatLabel>
        <StatNumber>
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </StatNumber>
        <StatHelpText>
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
        </StatHelpText>
      </Stat>
    </Box>
  )
}

export default SubscriptionItemSkeleton
