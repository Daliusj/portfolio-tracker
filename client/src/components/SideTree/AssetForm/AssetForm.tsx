import { Modal, Button, Dropdown, Table } from 'flowbite-react'
import TableHead from './AssetSelector/AssetsTables/TableHead'
import React, { useState } from 'react'
import type { BaseCurrency } from '@server/shared/types'
import { AssetPublic } from '@server/shared/types'
import { HiFolder } from 'react-icons/hi'
import TableRow from './AssetSelector/AssetsTables/TableRow'
import AssetSelector from './AssetSelector/AssetSelector'

type PortfolioFormProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ({ openModal, setOpenModal }: PortfolioFormProps) {
  const [currencySymbol, setCurrencySymbol] = useState<BaseCurrency>('USD')
  const [selectedPortfolio, setSelectedPortfolio] = useState('Portfolio One')
  const [selectedAsset, setSelectedAsset] = useState<AssetPublic | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [allowSelectAsset, setAllowSelectAsset] = useState(false)

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
            {!allowSelectAsset && (
              <Button color="blue" onClick={() => setAllowSelectAsset(true)}>
                <HiFolder size={28} />
                Select asset
              </Button>
            )}

            {allowSelectAsset && !selectedAsset && (
              <AssetSelector
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
              />
            )}
            {selectedAsset && (
              <Table hoverable>
                <TableHead />
                <Table.Body>
                  <TableRow
                    asset={selectedAsset}
                    handleClickRow={(asset: AssetPublic | undefined) => setSelectedAsset(asset)}
                    isSelected={true}
                  />
                </Table.Body>
              </Table>
            )}

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
