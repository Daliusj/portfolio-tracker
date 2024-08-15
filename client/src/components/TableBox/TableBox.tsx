import { Table } from 'flowbite-react'
import React from 'react'
import TableRow from './Row'
import TableHead from './Head'
import { usePortfolio } from '@/context/PortfolioContext'
import { trpc } from '@/trpc'

export default function () {
  const { activePortfolio } = usePortfolio()
  const assetStats =
    activePortfolio && trpc.portfolioStats.get.useQuery({ id: activePortfolio?.id })

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
