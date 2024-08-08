import { Modal, TextInput, Button, Dropdown } from 'flowbite-react'
import React, { useState } from 'react'
import type { BaseCurrency } from '@server/shared/types'
import { HiSearch } from 'react-icons/hi'
import { trpc } from '@/trpc'
import AssetsTable from './AssetsTable/AssetsTable'
import { AssetPublic } from '@server/shared/types'

type PortfolioFormProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ({ openModal, setOpenModal }: PortfolioFormProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currencySymbol, setCurrencySymbol] = useState<BaseCurrency>('USD')
  const [selectedPortfolio, setSelectedPortfolio] = useState('Portfolio One')
  const [selectedAsset, setSelectedAsset] = useState<AssetPublic | undefined>(undefined)
  const [allowQuery, setAllowQuery] = useState<boolean>(false)

  const assetsQuery = trpc.asset.get.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 2 && allowQuery === true }
  )

  const handleSubmit = () => {
    console.log(selectedPortfolio, selectedAsset)
    setOpenModal(false)
  }

  const onCloseModal = () => {
    setOpenModal(false)
    setSearchQuery('')
  }

  const handleDropDownChange = (portfolio: string) => {
    setSelectedPortfolio(portfolio)
  }

  const handleSearchButton = () => {
    console.log(assetsQuery.data)
    setAllowQuery(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchButton()
    }
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowQuery(false)
    setSearchQuery(event.target.value)
  }

  return (
    <div>
      <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Add Asset</h3>
              <Dropdown color="blue" label={selectedPortfolio} dismissOnClick={true}>
                <Dropdown.Item onClick={() => handleDropDownChange('Portfolio One')}>
                  Portfolio One
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleDropDownChange('Portfolio Two')}>
                  Portfolio Two
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="flex ">
              <TextInput
                id="search-query"
                placeholder="Stock name"
                value={searchQuery}
                onKeyDown={handleKeyDown}
                onChange={handleSearchInputChange}
                required
              />
              <Button color="blue" onClick={handleSearchButton}>
                <HiSearch size={22} />
              </Button>
            </div>
            <AssetsTable
              assets={assetsQuery.data}
              setSelectedAsset={setSelectedAsset}
              selectedAsset={selectedAsset}
            />

            <fieldset className="flex max-w-md flex-col gap-4 text-gray-900 dark:text-white">
              <legend className="mb-4">Portfolio currency</legend>
            </fieldset>
            <Button onClick={handleSubmit} color="blue" aria-hidden="false">
              Create
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
