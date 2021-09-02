import * as RD from '@/lib/remoteData'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as simpleIcons from 'react-icons/si'

import { Box, Flex, Heading, Icon, IconButton, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { flow, pipe } from 'fp-ts/lib/function'

import { CgMail } from 'react-icons/cg'
import Link from 'next/link'
import { Subscription } from '@/lib/subscription/codable'
import useNextBilling from '@/lib/subscription/useNextBilling'
import useTranslation from 'next-translate/useTranslation'

type SubscriptionItemProps = Subscription & {
  onDelete: (id: string) => TE.TaskEither<Error, unknown>
  currencyFormatter: Intl.NumberFormat
}

const SubscriptionItem = (item: SubscriptionItemProps): JSX.Element => {
  const [isDeleting, setIsDeleting] = useState<RD.RemoteData<Error, unknown>>(RD.notAsked)
  const [, icon] = Object.entries(simpleIcons).find(([key]) => key === item.icon) || []
  const price = item.currencyFormatter.format(item.price)
  const { formattedFirstBilling, formattedCurrentBilling, timeUntilNextBilling } = useNextBilling(item)
  const { t } = useTranslation('common')

  function onDelete() {
    setIsDeleting(RD.pending)
    return pipe(
      item.id,
      item.onDelete,
      TE.fold<Error, unknown, RD.RemoteData<Error, never> | RD.RemoteData<never, unknown>>(
        flow(RD.failure, T.of),
        flow(RD.success, T.of),
      ),
      T.map(setIsDeleting),
    )()
  }

  return (
    <Box p={4} shadow="md" borderWidth="1px" rounded="lg" textAlign={['center', 'left']} direction="column">
      <Flex align="center" justify={['center', 'flex-start']}>
        <Icon mr={2} width="18px" as={icon || CgMail} />
        <Heading as="h3" size="md">
          {item.name}
        </Heading>
      </Flex>

      <Stat mt={4}>
        <StatLabel>
          <span>
            {t('every')}
            <strong>{item.cycleAmount}</strong>
            {t(item.cyclePeriod)}
          </span>
        </StatLabel>
        <StatNumber>{price}</StatNumber>
        <StatHelpText>{t('first_bill_date', { date: formattedFirstBilling })}</StatHelpText>
        <StatHelpText>{t('next_bill', { date: formattedCurrentBilling })}</StatHelpText>
        <StatHelpText>{t('in_date', { time: timeUntilNextBilling })}</StatHelpText>
        <IconButton
          aria-label={t('delete_subscription', { name: item.name })}
          colorScheme="red"
          variant="outline"
          size="sm"
          icon={<DeleteIcon />}
          onClick={onDelete}
          isLoading={RD.isPending(isDeleting)}
          isDisabled={RD.isPending(isDeleting)}
          mr="2"
        />
        <Link
          href={{
            pathname: '/subscriptions/[id]',
            query: { id: item.id },
          }}
        >
          <a>
            <IconButton aria-label={t('edit_subscription')} icon={<EditIcon />} />
          </a>
        </Link>
      </Stat>
    </Box>
  )
}

export default SubscriptionItem
