import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { PortfolioItemProvider } from '@/context/PortfolioItemContext'
import { PortfolioAssetsProvider } from '@/context/portfolioAssets'
import { usePortfolio } from '@/context/PortfolioContext'
import Stats from '@/components/Stats'

export default function () {
  const { activePortfolio } = usePortfolio()

  return (
    <div className="flex h-full">
      {activePortfolio && (
        <PortfolioItemProvider>
          <PortfolioAssetsProvider>
            <Sidebar />
            <Stats />
          </PortfolioAssetsProvider>
        </PortfolioItemProvider>
      )}
    </div>
  )
}
