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
import PurchaseTable from './PurchasesTable/PurchasesTable'
import { trpc } from '@/trpc'
import { localDateToIsoString } from '@/utils/time'
import getSymbolFromCurrency from 'currency-symbol-map'

type PortfolioFormProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  mode: 'edit' | 'create' | 'createWithBase'
  asset?: FullPortfolioGroupedPublic
}

export default function PortfolioForm({
  openModal,
  setOpenModal,
  mode,
  asset,
}: PortfolioFormProps) {
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
  const [currencySymbol, setCurrencySymbol] = useState('')
  const { create, update } = usePortfolioItem()

  const currencyCode = trpc.exchange.getByShortName.useQuery(
    { shortName: selectedAsset?.exchangeShortName || '' },
    { enabled: false }
  )

  const clearInputs = () => {
    setSelectedAsset(undefined)
    setQuantity(undefined)
    setPrice(undefined)
    setDate(new Date())
    setSearchQuery('')
    setSelectedPurchase(undefined)
    setPreventSelectAsset(false)
    setHasLoaded(false)
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

      onCloseModal()
    }
  }

  const onCloseModal = () => {
    clearInputs()
    setOpenModal(false)
  }

  const handleDropDownChange = (portfolio: PortfolioPublic) => {
    clearInputs()
    setSelectedPortfolio(portfolio)
  }

  const baseAsset =
    (mode === 'edit' || mode === 'createWithBase') &&
    asset &&
    trpc.asset.getById.useQuery({ id: [asset.assetId] })

  useEffect(() => {
    if (openModal) {
      if (mode === 'edit' && asset && baseAsset) {
        if (!hasLoaded && baseAsset.isFetched && baseAsset.isSuccess) {
          setSelectedPortfolio(userPortfolio.activePortfolio)
          setSelectedPurchase(asset.purchases[0])
          setSelectedAsset(baseAsset.data[0])
          setPreventSelectAsset(true)
          setHasLoaded(true)
        }
      } else if (mode === 'create') {
        clearInputs()
        setHasLoaded(true)
      } else if (
        mode === 'createWithBase' &&
        baseAsset &&
        !hasLoaded &&
        baseAsset.isFetched &&
        baseAsset.isSuccess
      ) {
        setSelectedPortfolio(userPortfolio.activePortfolio)
        setSelectedAsset(baseAsset.data[0])
        setPreventSelectAsset(true)
        setHasLoaded(true)
      }
    }
  }, [openModal, baseAsset])

  useEffect(() => {
    selectedAsset && currencyCode.refetch()
    if (currencyCode?.data?.currencyCode) {
      const symbol = getSymbolFromCurrency(currencyCode.data.currencyCode)
      if (symbol) setCurrencySymbol(symbol)
    }
  }, [currencyCode?.data?.currencyCode])

  useEffect(() => {
    if (selectedPurchase) {
      setQuantity(Number(selectedPurchase?.quantity))
      setPrice(Number(selectedPurchase?.purchasePrice))
      setDate(selectedPurchase?.purchaseDate)
    }
    if ((selectedAsset && mode === 'create') || mode === 'createWithBase') {
      setQuantity(1)
      setPrice(Number(selectedAsset?.price))
      setDate(new Date())
    }
  }, [selectedPurchase, selectedAsset])

  useEffect(() => {
    if (selectedPurchase) {
      setQuantity(Number(selectedPurchase?.quantity))
      setPrice(Number(selectedPurchase?.purchasePrice))
      setDate(selectedPurchase?.purchaseDate)
    }
  }, [selectedPurchase])

  useEffect(() => {
    setSelectedPortfolio(userPortfolio.activePortfolio)
  }, [userPortfolio.activePortfolio])

  return (
    <div>
      {openModal && (
        <Modal show={openModal} size="4xl" onClose={onCloseModal} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {mode === 'edit' ? 'Edit Asset' : 'Add Asset'}
                </h3>
                <Dropdown
                  color="blue"
                  label={selectedPortfolio?.name}
                  dismissOnClick={true}
                  disabled={mode === 'edit' || mode == 'createWithBase'}
                >
                  {userPortfolio.userPortfolios?.map((portfolio) => (
                    <Dropdown.Item
                      onClick={() => handleDropDownChange(portfolio)}
                      key={portfolio.id}
                    >
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
                  setOpenAssetModal={setOpenModal}
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
                          handleClickRow={(asset: AssetPublic | undefined) =>
                            setSelectedAsset(asset)
                          }
                          isSelected={true}
                          isDisabled={mode === 'edit' || mode == 'createWithBase'}
                        />
                      </Table.Body>
                    </Table>
                  )}
                </div>
              </div>
              {!selectedAsset && <p className="text-sm text-red-600">Select asset</p>}

              <fieldset className="flex flex-col text-gray-900 dark:text-white">
                <legend className="mb-4">Quantity</legend>
                <TextInput
                  value={quantity !== undefined && !isNaN(quantity) ? quantity : ''}
                  type="number"
                  min={0}
                  onChange={(event) => setQuantity(event.target.valueAsNumber)}
                  placeholder="Enter quantity"
                  required
                />
                <p className="h-8 text-sm text-red-600">
                  {!quantity && 'Enter purchased asset quantity'}
                </p>
                <legend className="mt-4">{`Total Purchase Price, ${currencySymbol} `}</legend>
                <TextInput
                  value={price !== undefined && !isNaN(price) ? price : ''}
                  type="number"
                  placeholder="Enter price"
                  min={0}
                  onChange={(event) => setPrice(event.target.valueAsNumber)}
                  required
                />
                <p className="h-8  text-sm text-red-600">{!price && 'Enter purchase price'}</p>
                <legend className="mt-4">Purchase date</legend>
                <Datepicker
                  value={date ? localDateToIsoString(date) : ''}
                  onSelectedDateChanged={(date) =>
                    date?.getTime() < new Date().getTime() && setDate(date)
                  }
                  showTodayButton={false}
                  autoHide={true}
                  required
                />
                <p className="h-8  text-sm text-red-600">{!date && 'Select purchase date'}</p>
              </fieldset>

              <Button
                className="mt-10"
                type="submit"
                onClick={handleSubmit}
                color="blue"
                aria-hidden="false"
              >
                Submit
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}
