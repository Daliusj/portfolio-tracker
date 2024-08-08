import { Table } from 'flowbite-react'
import React, { useId } from 'react'
import { AssetPublic } from '@server/shared/types'

type TableRowProps = {
  asset: AssetPublic
  handleClickRow: (asset: AssetPublic | undefined) => void
  isSelected: boolean
}
export default function ({ asset, handleClickRow, isSelected }: TableRowProps) {
  return (
    <Table.Row
      onClick={() => handleClickRow(isSelected ? undefined : asset)}
      className={` dark:border-gray-700 ${isSelected ? 'bg-blue-800 dark:bg-blue-800' : ' bg-white dark:bg-gray-800'} `}
      key={useId()}
    >
      <Table.Cell className="font-small whitespace-wrap text-gray-900 dark:text-white">
        {`${asset.name}(${asset.symbol})`}
      </Table.Cell>
      <Table.Cell>{asset.type}</Table.Cell>
      <Table.Cell>{Number(asset.price).toFixed(2)}</Table.Cell>
      <Table.Cell>{`${asset.exchange}(${asset.exchangeShortName})`}</Table.Cell>
    </Table.Row>
  )
}
