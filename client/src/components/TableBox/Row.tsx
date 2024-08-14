import { Table } from 'flowbite-react'
import React, { useId } from 'react'
import { FullPortfolioGroupedPublic } from '@server/shared/types'

type TableRowProps = {
  asset: FullPortfolioGroupedPublic
}
export default function ({ asset }: TableRowProps) {
  const cellStyles = 'font-small whitespace-no-wrap items-center text-gray-900 dark:text-white'

  const totalQuantity = asset.purchases.reduce(
    (acc, purchase) => acc + Number(purchase.quantity),
    0
  )
  const avgBuyPrice =
    asset.purchases.reduce((acc, purchase) => acc + Number(purchase.purchasePrice), 0) /
    totalQuantity

  const totalValue = Number(asset.assetPrice) * totalQuantity

  return (
    <Table.Row className={` bg-white dark:border-gray-700 dark:bg-gray-800 `} key={useId()}>
      <Table.Cell className={cellStyles}>{asset.assetName}</Table.Cell>
      <Table.Cell className={cellStyles}>{totalQuantity}</Table.Cell>
      <Table.Cell className={cellStyles}>{avgBuyPrice}</Table.Cell>
      <Table.Cell className={cellStyles}>Allocation</Table.Cell>
      <Table.Cell className={cellStyles}>{asset.assetPrice}</Table.Cell>
      <Table.Cell className={cellStyles}>{totalValue}</Table.Cell>
    </Table.Row>
  )
}
