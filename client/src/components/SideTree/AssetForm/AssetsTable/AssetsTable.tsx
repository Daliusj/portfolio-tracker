import { Table } from 'flowbite-react'
import React from 'react'
import { AssetPublic } from '@server/shared/types'
import TableRow from './tableRow'

type AssetsTableProps = {
  assets: AssetPublic[] | undefined
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetPublic | undefined>>
  selectedAsset: AssetPublic | undefined
}

export default function ({ assets, setSelectedAsset, selectedAsset }: AssetsTableProps) {
  const handleClickRow = (asset: AssetPublic | undefined) => {
    setSelectedAsset(asset)
  }
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Type</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Exchange</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {!assets?.length && selectedAsset && (
            <TableRow asset={selectedAsset} handleClickRow={handleClickRow} isSelected={true} />
          )}
          {assets &&
            assets.map((asset) => (
              <TableRow
                key={asset.id}
                asset={asset}
                handleClickRow={handleClickRow}
                isSelected={asset.id === selectedAsset?.id}
              />
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
