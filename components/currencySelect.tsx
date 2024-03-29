import * as A from 'fp-ts/Array'

import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react'
/* eslint-disable jsx-a11y/no-autofocus, react/display-name */
import React, { useCallback, useEffect, useState } from 'react'
import currencies, { Currency } from '@/lib/currencyList'
import { flow, pipe } from 'fp-ts/lib/function'

import { SearchIcon } from '@chakra-ui/icons'
import useTranslation from 'next-translate/useTranslation'

const currencyKeys = Object.keys(currencies)

type CurrencySelectProps = {
  id: string
  value: string
  isLoading?: boolean
  onSelect: (currency: string) => void
}

type SelectedProps = {
  selected?: string
  onSelect: (currency: string) => void
}

type CurrencyListProps = SelectedProps & {
  currencies: string[]
}

type CurrencyListItemProps = SelectedProps & {
  currency: Currency
}

type CurrencyCache = {
  [key: string]: (props: SelectedProps) => JSX.Element
}

const CurrencyListItem = (props: CurrencyListItemProps) => (
  <Button
    aria-label={props.currency.name}
    onClick={() => props.onSelect(props.currency.code)}
    border="1px"
    borderColor={props.currency.code === props.selected ? 'blue.300' : 'gray.600'}
  >
    {props.currency.symbolNative}
  </Button>
)

const currencyButtons: CurrencyCache = pipe(
  Object.values(currencies),
  A.reduce<Currency, CurrencyCache>({}, (acc, currency) => ({
    ...acc,
    [currency.code]: (props: SelectedProps) => (
      <CurrencyListItem currency={currency} selected={props.selected} onSelect={props.onSelect} />
    ),
  })),
)

const CurrencyList = React.memo((props: CurrencyListProps) => (
  <SimpleGrid columns={7} gap={4}>
    {props.currencies.map((key) =>
      React.createElement<SelectedProps>(currencyButtons[key], {
        onSelect: props.onSelect,
        selected: props.selected,
        key,
      }),
    )}
  </SimpleGrid>
))

const CurrencySelect = (props: CurrencySelectProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchTerm, setSearchTerm] = useState('')
  const [currencyList, setCurrencyList] = useState<string[]>([])
  const { t } = useTranslation('common')

  useEffect(() => setCurrencyList(currencyKeys), [])

  const searchButtonClicked = useCallback(
    () => setCurrencyList(currencyKeys.filter((key) => key.toLowerCase().includes(searchTerm.toLowerCase()))),
    [searchTerm],
  )

  const currencySelected = useCallback((code: string) => flow(props.onSelect, onClose)(code), [onClose, props.onSelect])

  const foundCurrencyKey = currencyKeys.find((key) => key === props.value)
  const buttonContent = foundCurrencyKey ? (
    <span>{currencies[foundCurrencyKey].symbolNative}</span>
  ) : (
    <span>{t('select_currency')}</span>
  )

  return (
    <>
      <ButtonGroup isAttached variant="outline">
        <Button id={props.id} onClick={onOpen} isDisabled={props.isLoading} isLoading={props.isLoading}>
          {buttonContent}
        </Button>
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <InputGroup size="md">
              <Input
                id="icon-search"
                placeholder={t('search_currency')}
                autoFocus={true}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchButtonClicked()}
              />
              <InputRightElement>
                <IconButton aria-label={t('search')} onClick={searchButtonClicked} icon={<SearchIcon />} />
              </InputRightElement>
            </InputGroup>
          </ModalHeader>
          <ModalBody pb={6}>
            <CurrencyList selected={props.value} currencies={currencyList} onSelect={currencySelected} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CurrencySelect
