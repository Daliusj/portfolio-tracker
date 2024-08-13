import { Modal, Button, Dropdown, Table, TextInput, Datepicker } from 'flowbite-react'
import TableHead from './AssetSelector/AssetTables/Head'
import React, { useEffect, useState } from 'react'
import { AssetPublic, FullPortfolioGroupedPublic, Purchase } from '@server/shared/types'
import TableRow from './AssetSelector/AssetTables/Row'
import AssetSelector from './AssetSelector/AssetSelector'
import { PortfolioPublic } from '@server/shared/types'
import { usePortfolio } from '@/context/PortfolioContext'
import { usePortfolioItem } from '@/context/PortfolioItemContext'
import { Selectable } from 'kysely'
import PurchaseTable from './AssetSelector/PurchaseHistoryTable/PurchaseTable'
import { trpc } from '@/trpc'

type PortfolioFormProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  mode: 'edit' | 'create' | 'createWithBase'
  asset?: FullPortfolioGroupedPublic
}

export default function ({ openModal, setOpenModal, mode, asset }: PortfolioFormProps) {
  const userPortfolio = usePortfolio()
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioPublic | undefined>(
    userPortfolio.activePortfolio
  )
  const [selectedAsset, setSelectedAsset] = useState<AssetPublic | undefined>(undefined)
  const [quantity, setQuantity] = useState<number | undefined>(undefined)
  const [price, setPrice] = useState<number | undefined>(undefined)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [preventSelectAsset, setPreventSelectAsset] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<Selectable<Purchase> | undefined>(
    undefined
  )
  const { create, update, remove } = usePortfolioItem()

  const clearInputs = () => {
    setSelectedPortfolio(undefined)
    setSelectedAsset(undefined)
    setQuantity(undefined)
    setPrice(undefined)
    setDate(undefined)
    setSearchQuery('')
    setSelectedPurchase(undefined)
    setOpenModal(false)
  }

  const handleSubmit = () => {
    if (selectedPortfolio && selectedAsset && quantity && price && date) {
      ;(mode === 'create' || mode === 'createWithBase') &&
        create({
          quantity,
          assetId: selectedAsset.id,
          portfolioId: selectedPortfolio.id,
          purchaseDate: date,
          purchasePrice: price,
        })
      mode === 'edit' &&
        selectedPurchase &&
        update({
          id: selectedPurchase?.portfolioItemId,
          quantity,
          assetId: selectedAsset.id,
          portfolioId: selectedPortfolio.id,
          purchaseDate: date,
          purchasePrice: price,
        })

      clearInputs()
    }
  }

  const onCloseModal = () => {
    clearInputs()
    setOpenModal(false)
    setSearchQuery('')
  }

  const handleDropDownChange = (portfolio: PortfolioPublic) => {
    setSelectedPortfolio(portfolio)
  }

  const formatDate = (date) => {
    return date
      ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
      : ''
  }

  const baseAsset =
    (mode === 'edit' || mode === 'createWithBase') &&
    asset &&
    trpc.asset.getById.useQuery({ id: [asset.assetId] })

  useEffect(() => {
    if (mode === 'edit' && asset && baseAsset) {
      if (!hasLoaded && baseAsset.isFetched && baseAsset.isSuccess) {
        setSelectedPurchase(asset.purchases[0])
        setSelectedAsset(baseAsset.data[0])
        setPreventSelectAsset(true)
        setHasLoaded(true)
      }
    }
  }, [baseAsset])

  useEffect(() => {
    setQuantity(Number(selectedPurchase?.quantity))
    setPrice(Number(selectedPurchase?.purchasePrice))
    setDate(selectedPurchase?.purchaseDate)
  }, [selectedPurchase])

  return (
    <div>
      <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {mode === 'edit' ? 'Edit Asset' : 'Add Asset'}
              </h3>
              <Dropdown color="blue" label={selectedPortfolio?.name} dismissOnClick={true}>
                {userPortfolio.userPortfolios?.map((portfolio) => (
                  <Dropdown.Item onClick={() => handleDropDownChange(portfolio)} key={portfolio.id}>
                    {portfolio.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
            {mode === 'edit' && asset?.purchases && (
              <PurchaseTable
                selectedPurchase={selectedPurchase}
                setSelectedPurchase={setSelectedPurchase}
                purchases={asset.purchases}
              />
            )}
            <div className="rounded-lg border border-solid border-gray-600">
              <div className="mx-2 my-5">
                {!preventSelectAsset && (
                  <Button
                    color="blue"
                    className="flex items-center justify-center"
                    onClick={() => setPreventSelectAsset(true)}
                  >
                    Select asset
                  </Button>
                )}

                {preventSelectAsset && !selectedAsset && (
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
                value={date && formatDate(date)}
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
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
