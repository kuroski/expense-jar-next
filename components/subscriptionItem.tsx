import * as RD from '@/lib/remoteData'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as simpleIcons from 'react-icons/si'

import { Box, Flex, Icon, IconButton, SimpleGrid, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { flow, pipe } from 'fp-ts/lib/function'

import { CgMail } from 'react-icons/cg'
import { DeleteIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { Subscription } from '@/lib/subscription/codable'
import useNextBilling from '@/lib/subscription/useNextBilling'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

type SubscriptionItemProps = Subscription & {
  onDelete: (listId: string, id: string) => TE.TaskEither<Error, unknown>
  currencyFormatter: Intl.NumberFormat
}

const SubscriptionItem = (props: SubscriptionItemProps): JSX.Element => {
  const router = useRouter()
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug

  const [isDeleting, setIsDeleting] = useState<RD.RemoteData<Error, unknown>>(RD.notAsked)
  const [, icon] = Object.entries(simpleIcons).find(([key]) => key === props.icon) || []
  const price = props.currencyFormatter.format(props.price)
  const { formattedFirstBilling, formattedCurrentBilling, timeUntilNextBilling } = useNextBilling(props)
  const { t } = useTranslation('common')

  function onDelete() {
    setIsDeleting(RD.pending)
    return pipe(
      props.onDelete(props.listId, props.id),
      TE.fold<Error, unknown, RD.RemoteData<Error, never> | RD.RemoteData<never, unknown>>(
        flow(RD.failure, T.of),
        flow(RD.success, T.of),
      ),
      T.map(setIsDeleting),
    )()
  }

  return (
    <Flex>
      <Box
        flex="1"
        p="4"
        bgColor={`${props.color}.700`}
        roundedLeft="md"
        _hover={{
          background: `${props.color}.600`,
        }}
      >
        <Link
          href={{
            pathname: '/lists/[slug]/subscriptions/[id]',
            query: { slug, id: props.id },
          }}
        >
          <a>
            <SimpleGrid columns={2} alignItems="center">
              <Flex direction="column">
                <Flex align="center">
                  <Icon mr="1" width="18px" as={icon || CgMail} />
                  <Text fontWeight="semibold">{props.name}</Text>
                </Flex>
                <Text fontSize="xs" fontWeight="thin">
                  {t('every', {
                    amount: props.cycleAmount,
                    period: t(props.cyclePeriod),
                  })}
                </Text>
                <Text fontSize="x-small" fontWeight="thin">
                  {t('first_bill_date', { date: formattedFirstBilling })}
                </Text>
              </Flex>

              <Flex direction="column" align="flex-end">
                <Text fontSize="sm">{price}</Text>
                <Text fontSize="sm" fontWeight="thin">
                  {t('in_date', { time: timeUntilNextBilling })}
                </Text>
                <Text fontSize="x-small" fontWeight="thin">
                  ({formattedCurrentBilling})
                </Text>
              </Flex>
            </SimpleGrid>
          </a>
        </Link>
      </Box>

      <IconButton
        aria-label={t('delete_subscription', { name: props.name })}
        colorScheme="red"
        variant="outline"
        height="auto"
        size="sm"
        borderLeftRadius="0"
        icon={<DeleteIcon />}
        onClick={onDelete}
        isLoading={RD.isPending(isDeleting)}
        isDisabled={RD.isPending(isDeleting)}
      />
    </Flex>
  )
}

export default SubscriptionItem
