import { BASE_CURRENCIES } from '../../../../server/src/shared/baseCurrencies'
import { Modal, Label, TextInput, Button } from 'flowbite-react'
import React, { useEffect, useId, useState } from 'react'
import RadioOptions from './RadioOptions'
import type { BaseCurrency } from '@server/shared/types'
import { usePortfolio } from '@/context/PortfolioContext'

type PortfolioFormProps = {
  mode: 'new' | 'edit'
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ({ openModal, setOpenModal, mode }: PortfolioFormProps) {
  const userPortfolio = usePortfolio()
  const [portfolioName, setPortfolioName] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState<BaseCurrency>('USD')

  const handleSubmit = () => {
    mode === 'edit' && userPortfolio.activePortfolio
      ? userPortfolio.update({
          id: userPortfolio.activePortfolio?.id,
          name: portfolioName,
          currencySymbol,
        })
      : userPortfolio.create({ name: portfolioName, currencySymbol })

    setOpenModal(false)
  }

  useEffect(() => {
    if (
      mode === 'edit' &&
      userPortfolio.activePortfolio?.name &&
      userPortfolio.activePortfolio?.currencySymbol
    ) {
      setPortfolioName(userPortfolio.activePortfolio?.name)
      setCurrencySymbol(userPortfolio.activePortfolio?.currencySymbol as BaseCurrency)
    } else {
      setPortfolioName('')
      setCurrencySymbol('USD')
    }
  }, [mode, userPortfolio.activePortfolio])

  const onCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <div>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edit portfolio' : 'Create new Portfolio'}
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="portofolioName" value="Portfolio name" />
              </div>
              <TextInput
                id="portofolioName"
                placeholder="My Portfolio"
                value={portfolioName}
                onChange={(event) => setPortfolioName(event.target.value)}
                required
              />
            </div>

            <fieldset className="flex max-w-md flex-col gap-4 text-gray-900 dark:text-white">
              <legend className="mb-4">Portfolio currency</legend>

              {BASE_CURRENCIES.map((currency) => (
                <RadioOptions
                  key={useId()}
                  currency={currency}
                  portfolioCurrency={currencySymbol}
                  setPortfolioCurrency={setCurrencySymbol}
                />
              ))}
            </fieldset>
            <Button onClick={handleSubmit} color="blue">
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
