import { usePortfolio } from '@/context/PortfolioContext'
import React from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import ProfitLoss from './ProfitLoss'
import { useStats } from '@/context/StatsContex'

export default function PortfolioProfitLoss() {
  const { activePortfolio } = usePortfolio()
  const { portfolioStats } = useStats()

  return (
    <div className="mb-4 w-full flex-col text-sm text-gray-900 dark:text-white">
      <div>Portfolio Balance</div>
      <div className="f-full flex justify-between">
        <div className="h-[40px] text-2xl text-gray-900 dark:text-white">
          {`${getSymbolFromCurrency(activePortfolio?.currencySymbol || '')}${portfolioStats?.totalPortfolioValue}`}
        </div>
        {portfolioStats && portfolioStats?.totalPortfolioValue !== '0' && (
          <ProfitLoss asset={portfolioStats} full={true} flat={false} />
        )}
      </div>
    </div>
  )
}
