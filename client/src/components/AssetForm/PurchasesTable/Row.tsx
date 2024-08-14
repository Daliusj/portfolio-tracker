import { Button, Table } from 'flowbite-react'
import React, { useId, useState } from 'react'
import { Purchase } from '@server/shared/types'
import { Selectable } from 'kysely'
import { localDateToIsoString } from '../../../utils/time'
import { HiOutlineXCircle } from 'react-icons/hi'
import { usePortfolioItem } from '@/context/PortfolioItemContext'
import ConfirmationModal from '@/components/ConfirmationModal'

type PurchaseTableRowProps = {
  purchase: Selectable<Purchase>
  handleClickRow: (purchase: Selectable<Purchase>) => void
  isSelected: boolean
  isDisabled?: boolean
}

export default function ({
  purchase,
  handleClickRow,
  isSelected,
  isDisabled,
}: PurchaseTableRowProps) {
  const { remove } = usePortfolioItem()
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)

  const handleDeleteButton = () => setOpenConfirmationModal(true)

  const deletePurchase = () => {
    remove({ id: purchase.portfolioItemId })
  }

  return (
    <Table.Row
      onClick={() => !isSelected && handleClickRow(purchase)}
      className={`dark:border-gray-700 ${isSelected ? 'bg-blue-800 dark:bg-blue-800' : 'bg-white dark:bg-gray-800'}`}
      key={useId()}
    >
      <Table.Cell>{localDateToIsoString(purchase.purchaseDate)}</Table.Cell>
      <Table.Cell>{purchase.quantity}</Table.Cell>
      <Table.Cell className="flex justify-between">
        {Number(purchase.purchasePrice).toFixed(2)}
        {!isDisabled && (
          <Button
            onClick={() => handleDeleteButton()}
            className="m-0 flex h-5 w-5 items-center justify-center p-0"
          >
            <HiOutlineXCircle className="h-5 w-5 p-0" />
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
