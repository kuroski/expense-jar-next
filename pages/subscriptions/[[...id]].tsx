import { Box, Button, Center, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import useSubscription from '@/framework/subscriptions/useSubscription'
import { MdRefresh } from 'react-icons/md'
import { AnimatePresence, motion, Variants } from 'framer-motion'

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
}

const EditSubscription = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query

  const { subscription, isLoading, error, mutate } = useSubscription(String(id))

  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      {isLoading && <div>Loading...</div>}
      {error && (
        <Center display="flex" flexDirection="column">
          <h1>An error ocurred!</h1>
          <Button mt={2} leftIcon={<MdRefresh />} onClick={mutate}>
            Retry
          </Button>
        </Center>
      )}
      {subscription && (
        <AnimatePresence>
          <motion.div variants={container} initial="hidden" animate="show">
            <SimpleGrid minChildWidth="170px" spacing={6} mt={4}>
              <motion.div
                key={subscription._id}
                variants={item}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              >
                <pre>{JSON.stringify(subscription, null, 4)}</pre>
              </motion.div>
            </SimpleGrid>
          </motion.div>
        </AnimatePresence>
      )}
    </Box>
  )
}

export default EditSubscription
