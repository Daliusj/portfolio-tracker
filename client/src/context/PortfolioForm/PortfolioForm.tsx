import { BASE_CURRENCIES } from '../../../../server/src/shared/baseCurrencies'
import { Modal, Label, TextInput, Button } from 'flowbite-react'
import React, { useId, useState } from 'react'
import RadioOptions from './RadioOptions'

export default function () {
  const [portfolioName, setPortfolioName] = useState('')
  const [portfolioCurrency, setPortfolioCurrency] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const handleSubmit = () => {
    console.log(portfolioName, portfolioCurrency)
    setOpenModal(false)
  }

  const onCloseModal = () => {
    setOpenModal(false)
    setPortfolioName('')
    setPortfolioCurrency(BASE_CURRENCIES[0])
  }

  return (
    <div>
      <Button color="green" size="sm" onClick={() => setOpenModal(true)}>
        Create Portfolio
      </Button>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Create new Portfolio
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
                  portfolioCurrency={portfolioCurrency}
                  setPortfolioCurrency={setPortfolioCurrency}
                />
              ))}
            </fieldset>
            <Button onClick={handleSubmit}>Create</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
