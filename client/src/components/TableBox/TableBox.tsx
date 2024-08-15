import { Table } from 'flowbite-react'
import React from 'react'
import TableRow from './Row'
import TableHead from './Head'
import { useStats } from '@/context/StatsContex'

export default function () {
  const assetStats = useStats()

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <TableHead />
        <Table.Body className="divide-y overflow-y-auto">
          {assetStats?.data &&
            assetStats.data.map((asset) => (
              <TableRow key={`${asset.assetId}-table-box`} asset={asset} />
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
