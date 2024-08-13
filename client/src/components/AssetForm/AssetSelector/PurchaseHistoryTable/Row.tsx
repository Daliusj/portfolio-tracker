import { Table } from 'flowbite-react'
import React, { useId } from 'react'
import { Purchase } from '@server/shared/types'
import { Selectable } from 'kysely'

type PurchaseTableRowProps = {
  purchase: Selectable<Purchase>
  handleClickRow: (purchase: Selectable<Purchase>) => void
  isSelected: boolean
}

export default function ({ purchase, handleClickRow, isSelected }: PurchaseTableRowProps) {
  return (
    <Table.Row
      onClick={() => !isSelected && handleClickRow(purchase)}
      className={`dark:border-gray-700 ${isSelected ? 'bg-blue-800 dark:bg-blue-800' : 'bg-white dark:bg-gray-800'}`}
      key={useId()}
    >
      <Table.Cell>{new Date(purchase.purchaseDate).toLocaleDateString()}</Table.Cell>
      <Table.Cell>{purchase.quantity}</Table.Cell>
      <Table.Cell>{Number(purchase.purchasePrice).toFixed(2)}</Table.Cell>
    </Table.Row>
  )
}
