import { Button, Table } from 'flowbite-react'
import React, { useId, useState } from 'react'
import { Purchase } from '@server/shared/types'
import { Selectable } from 'kysely'
import { localDateToIsoString } from '../../../utils/time'
import { HiXCircle } from 'react-icons/hi'
import { usePortfolioItem } from '@/context/PortfolioItemContext'
import ConfirmationModal from '@/components/ConfirmationModal'

type PurchaseTableRowProps = {
  purchase: Selectable<Purchase>
  handleClickRow: (purchase: Selectable<Purchase>) => void
  isSelected: boolean
  isDisabled?: boolean
  setOpenAssetModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Row({
  purchase,
  handleClickRow,
  isSelected,
  isDisabled,
  setOpenAssetModal,
}: PurchaseTableRowProps) {
  const { remove } = usePortfolioItem()
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const handleDeleteButton = () => setOpenConfirmationModal(true)

  const deletePurchase = () => {
    remove({ id: purchase.portfolioItemId })
    setOpenAssetModal(false)
  }

  return (
    <Table.Row
      onClick={() => !isSelected && handleClickRow(purchase)}
      className={`dark:border-gray-700 ${isSelected ? 'bg-blue-300 dark:bg-blue-800' : 'bg-white dark:bg-gray-800'}`}
      key={useId()}
    >
      <Table.Cell className=" text-gray-900 dark:text-white">
        {localDateToIsoString(purchase.purchaseDate)}
      </Table.Cell>
      <Table.Cell className=" text-gray-900 dark:text-white">{purchase.quantity}</Table.Cell>
      <Table.Cell className="flex justify-between text-gray-900 dark:text-white">
        {Number(purchase.purchasePrice).toFixed(2)}
        {!isDisabled && (
          <Button
            onClick={() => handleDeleteButton()}
            className="m-0 flex h-5 w-5 items-center justify-center p-0 pl-4"
          >
            <HiXCircle className="h-5 w-5 p-0 text-gray-900 dark:text-white" />
          </Button>
        )}
      </Table.Cell>
      <ConfirmationModal
        name={`${localDateToIsoString(purchase.purchaseDate)} purchase`}
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        onConfirm={deletePurchase}
      />
    </Table.Row>
  )
}
