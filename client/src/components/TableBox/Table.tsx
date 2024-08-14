import { Table } from 'flowbite-react'
import React from 'react'
import { FullPortfolioGroupedPublic } from '@server/shared/types'
import TableRow from './Row'
import TableHead from './Head'

type AssetsTableProps = {
  assets: FullPortfolioGroupedPublic[] | undefined
}

export default function ({ assets }: AssetsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead />
        <Table.Body className="divide-y overflow-y-auto">
          {assets &&
            assets.map((asset) => <TableRow key={`${asset.assetId}-table-box`} asset={asset} />)}
        </Table.Body>
      </Table>
    </div>
  )
}
