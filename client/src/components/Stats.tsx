import React from 'react'
import TableBox from '@/components/TableBox/TableBox'
import PortfolioProfitLoss from '@/components/PortfolioProfitLoss'
import { PortfolioStatsProvider } from '@/context/StatsContex'

export default function () {
  return (
    <PortfolioStatsProvider>
      <div className="flex w-full flex-col items-center space-x-[80px]">
        <PortfolioProfitLoss />
        <div className="mb-6 w-4/5">
          {' '}
          <TableBox />
        </div>
      </div>
    </PortfolioStatsProvider>
  )
}
