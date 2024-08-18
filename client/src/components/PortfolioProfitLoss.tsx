import { usePortfolio } from '@/context/PortfolioContext'
import React from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import ProfitLoss from './ProfitLoss'
import { useStats } from '@/context/StatsContex'

export default function PortfolioProfitLoss() {
  const { activePortfolio } = usePortfolio()
  const { portfolioStats } = useStats()

  return (
    <div className="mb-12 ml-80 w-full flex-col">
      <div>Portfolio Balance</div>
      <div className="flex space-x-4">
        <div className="text-2xl">
          {`${getSymbolFromCurrency(activePortfolio?.currencySymbol || '')}${portfolioStats?.totalPortfolioValue}`}
        </div>
        {portfolioStats && <ProfitLoss asset={portfolioStats} full={true} flat={true} />}
      </div>
    </div>
  )
}
