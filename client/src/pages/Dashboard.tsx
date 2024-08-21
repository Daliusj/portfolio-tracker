import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { PortfolioItemProvider } from '@/context/PortfolioItemContext'
import { PortfolioAssetsProvider } from '@/context/portfolioAssets'
import { usePortfolio } from '@/context/PortfolioContext'
import Stats from '@/components/Stats'
import { PortfolioStatsProvider } from '@/context/StatsContex'
import PortfolioProfitLoss from '@/components/PortfolioProfitLoss'

export default function Dashboard() {
  const { activePortfolio } = usePortfolio()

  return (
    <div className="flex">
      {activePortfolio && (
        <PortfolioItemProvider>
          <PortfolioAssetsProvider>
            <PortfolioStatsProvider>
              <div className="dashboard">
                <div>
                  <PortfolioProfitLoss />
                  <Sidebar />
                </div>
                <Stats />
              </div>
            </PortfolioStatsProvider>
          </PortfolioAssetsProvider>
        </PortfolioItemProvider>
      )}
    </div>
  )
}
