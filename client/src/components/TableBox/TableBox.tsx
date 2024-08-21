import { Table } from 'flowbite-react'
import React from 'react'
import TableRow from './Row'
import TableHead from './Head'
import { useStats } from '@/context/StatsContex'

export default function TableBox() {
  const { assetsStats } = useStats()

  return (
    <div className="stats-table overflow-x-auto">
      <Table hoverable>
        <TableHead />
        <Table.Body className="divide-y">
          {assetsStats &&
            assetsStats.map((asset) => (
              <TableRow key={`${asset.assetId}-table-box`} asset={asset} />
            ))}
        </Table.Body>
      </Table>
    </div>
  )
}
