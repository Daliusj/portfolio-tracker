import { Table } from 'flowbite-react'
import React from 'react'
import { Purchase } from '@server/shared/types'
import PurchaseTableRow from './Row'
import PurchaseTableHead from './Head'
import { Selectable } from 'kysely'

type PurchaseHistoryTableProps = {
  purchases: Selectable<Purchase>[] | undefined
  setSelectedPurchase: React.Dispatch<React.SetStateAction<Selectable<Purchase> | undefined>>
  selectedPurchase: Selectable<Purchase> | undefined
}

export default function ({
  purchases,
  setSelectedPurchase,
  selectedPurchase,
}: PurchaseHistoryTableProps) {
  const handleClickRow = (purchase: Selectable<Purchase>) => {
    setSelectedPurchase(purchase)
  }

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <PurchaseTableHead />
        <Table.Body className="divide-y">
          {purchases &&
            purchases.map((purchase) => (
              <PurchaseTableRow
                key={purchase.portfolioItemId}
                purchase={purchase}
                handleClickRow={handleClickRow}
                isSelected={purchase.portfolioItemId === selectedPurchase?.portfolioItemId}
              />
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
