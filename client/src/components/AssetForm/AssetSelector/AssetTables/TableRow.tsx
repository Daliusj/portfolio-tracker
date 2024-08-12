import { Button, Table } from 'flowbite-react'
import React, { useId } from 'react'
import { AssetPublic } from '@server/shared/types'
import { HiXCircle } from 'react-icons/hi'

type TableRowProps = {
  asset: AssetPublic
  handleClickRow: (asset: AssetPublic | undefined) => void
  isSelected: boolean
}
export default function ({ asset, handleClickRow, isSelected }: TableRowProps) {
  return (
    <Table.Row
      onClick={() => !isSelected && handleClickRow(asset)}
      className={` dark:border-gray-700 ${isSelected ? 'bg-blue-800 dark:bg-blue-800' : ' bg-white dark:bg-gray-800'} `}
      key={useId()}
    >
      <Table.Cell className="font-small whitespace-no-wrap flex items-center text-gray-900 dark:text-white">
        {isSelected && (
          <Button
            onClick={() => isSelected && handleClickRow(undefined)}
            className="flex h-5 w-5 items-center justify-center p-0"
          >
            <HiXCircle className="mr-3 h-5 w-5 p-0" />
          </Button>
        )}
        {`${asset.name}(${asset.symbol})`}
      </Table.Cell>
      <Table.Cell>{asset.type}</Table.Cell>
      <Table.Cell>{Number(asset.price).toFixed(2)}</Table.Cell>
      <Table.Cell>{`${asset.exchange}(${asset.exchangeShortName})`}</Table.Cell>
    </Table.Row>
  )
}
