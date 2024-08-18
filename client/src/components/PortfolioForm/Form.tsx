import { BASE_CURRENCIES } from '../../../../server/src/shared/baseCurrencies'
import { Label, TextInput, Button } from 'flowbite-react'
import React, { useEffect, useId, useState } from 'react'
import RadioOptions from './RadioOptions'
import type { BaseCurrency } from '@server/shared/types'
import { usePortfolio } from '@/context/PortfolioContext'

type PortfolioFormProps = {
  mode: 'new' | 'edit'
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  first?: boolean
}

export default function ({ setOpenModal, mode, first }: PortfolioFormProps) {
  const userPortfolio = usePortfolio()
  const [portfolioName, setPortfolioName] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState<BaseCurrency>('USD')

  const handleSubmit = () => {
    if (portfolioName) {
      mode === 'edit' && userPortfolio.activePortfolio
        ? userPortfolio.update({
            id: userPortfolio.activePortfolio?.id,
            name: portfolioName,
            currencySymbol,
          })
        : userPortfolio.create({ name: portfolioName, currencySymbol })

      setOpenModal && setOpenModal(false)
    }
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

  const getTitle = () => {
    if (mode === 'edit') return 'Edit portfolio'
    if (mode === 'new' && !first)
      return (
        <p>
          You don't have a portfolio! <br />
          Create one to start
        </p>
      )
    return 'Create Portfolio'
  }

  return (
    <div>
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">{getTitle()}</h3>
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
          <p className="mt-2 h-8 text-sm text-red-600">
            {!portfolioName && 'Enter Portfolio Name'}
          </p>
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
    </div>
  )
}
