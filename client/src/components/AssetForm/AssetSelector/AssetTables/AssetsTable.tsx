import { Table } from 'flowbite-react'
import React from 'react'
import { AssetPublic } from '@server/shared/types'
import TableRow from './Row'
import TableHead from './Head'

type AssetsTableProps = {
  assets: AssetPublic[] | undefined
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetPublic | undefined>>
  selectedAsset: AssetPublic | undefined
}

export default function AssetsTable({ assets, setSelectedAsset, selectedAsset }: AssetsTableProps) {
  const handleClickRow = (asset: AssetPublic | undefined) => {
    setSelectedAsset(asset)
  }
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead />
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
