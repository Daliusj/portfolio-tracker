import { Modal, Button, Dropdown, Table, TextInput, Datepicker } from 'flowbite-react'
import TableHead from './AssetSelector/AssetTables/TableHead'
import React, { useState } from 'react'
import { AssetPublic } from '@server/shared/types'
import TableRow from './AssetSelector/AssetTables/TableRow'
import AssetSelector from './AssetSelector/AssetSelector'
import { trpc } from '@/trpc'
import { PortfolioPublic } from '@server/shared/types'
import { usePortfolio } from '@/context/PortfolioContext'
import { usePortfolioItem } from '@/context/PortfolioItemContext'

type PortfolioFormProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ({ openModal, setOpenModal }: PortfolioFormProps) {
  const userPortfolio = usePortfolio()
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioPublic | undefined>(
    userPortfolio.activePortfolio
  )
  const [selectedAsset, setSelectedAsset] = useState<AssetPublic | undefined>(undefined)
  const [quantity, setQuantity] = useState<number | undefined>(undefined)
  const [price, setPrice] = useState<number | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [allowSelectAsset, setAllowSelectAsset] = useState(false)
  const { create } = usePortfolioItem()

  const handleSubmit = () => {
    if (selectedPortfolio && selectedAsset && quantity && price && date) {
      create({
        quantity,
        assetId: selectedAsset.id,
        portfolioId: selectedPortfolio.id,
        purchaseDate: date,
        purchasePrice: price,
      })
      setSelectedPortfolio(undefined)
      setSelectedAsset(undefined)
      setQuantity(undefined)
      setPrice(undefined)
      setDate(undefined)
      setOpenModal(false)
    }
  }

  const onCloseModal = () => {
    setOpenModal(false)
    setSearchQuery('')
  }

  const handleDropDownChange = (portfolio: PortfolioPublic) => {
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
              <Dropdown color="blue" label={selectedPortfolio?.name} dismissOnClick={true}>
                {userPortfolio.userPortfolios?.map((portfolio) => (
                  <Dropdown.Item onClick={() => handleDropDownChange(portfolio)} key={portfolio.id}>
                    {portfolio.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>

            <div className="rounded-lg border border-solid border-gray-600">
              <div className="mx-2 my-5">
                {!allowSelectAsset && (
                  <Button
                    color="blue"
                    className="flex items-center justify-center"
                    onClick={() => setAllowSelectAsset(true)}
                  >
                    Select asset
                  </Button>
                )}

                {allowSelectAsset && !selectedAsset && (
                  <div>
                    <AssetSelector
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      selectedAsset={selectedAsset}
                      setSelectedAsset={setSelectedAsset}
                    />
                  </div>
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
              </div>
            </div>
            {!selectedAsset && <p className="text-sm text-red-600">Select asset</p>}

            <fieldset className="flex max-w-md flex-col gap-4 text-gray-900 dark:text-white">
              <legend className="mb-4">Quantity</legend>
              <TextInput
                value={quantity !== undefined ? quantity : ''}
                type="number"
                onChange={(event) => setQuantity(event.target.valueAsNumber)}
                placeholder="Enter quantity"
                required
              />
              <p className="h-2 text-sm text-red-600">
                {!quantity && 'Enter purchased asset quantity'}
              </p>
              <legend className="mt-4">Purchase Price</legend>
              <TextInput
                value={price !== undefined ? price : ''}
                type="number"
                placeholder="Enter price"
                onChange={(event) => setPrice(event.target.valueAsNumber)}
                required
              />
              <p className="h-2  text-sm text-red-600">{!price && 'Enter purchase price'}</p>
              <legend className="mt-4">Purchase date</legend>
              <Datepicker
                onSelectedDateChanged={(date) => setDate(date)}
                autoHide={true}
                showTodayButton={true}
                required
              />
              <p className="h-2  text-sm text-red-600">{!date && 'Select purchase date'}</p>
              {date && (
                <p className="h-2  text-sm text-red-600">
                  {date?.getTime() > new Date().getTime() && 'Select purchase date'}
                </p>
              )}
            </fieldset>

            <Button type="submit" onClick={handleSubmit} color="blue" aria-hidden="false">
              Create
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
