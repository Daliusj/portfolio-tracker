import React from 'react'
import TableBox from '@/components/TableBox/TableBox'
import PortfolioProfitLoss from '@/components/PortfolioProfitLoss'
import { PortfolioStatsProvider } from '@/context/StatsContex'
import { usePortfolioItem } from '@/context/PortfolioItemContext'

export default function () {
  const { userPortfolioItems } = usePortfolioItem()

  return (
    <div className="flex w-full flex-col items-center space-x-[80px]">
      {userPortfolioItems?.length ? (
        <PortfolioStatsProvider>
          <PortfolioProfitLoss />
          <div className="mb-6 w-4/5">
            {' '}
            <TableBox />
          </div>
        </PortfolioStatsProvider>
      ) : (
        <div className="flex w-4/5 justify-center text-xl">
          <p>Nothing to show. Add assets to your portfolio</p>
        </div>
      )}
    </div>
  )
}
