import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { PortfolioItemProvider, usePortfolioItem } from '@/context/PortfolioItemContext'
import { PortfolioAssetsProvider, usePortfolioAssets } from '@/context/portfolioAssets'
import { usePortfolio } from '@/context/PortfolioContext'
import Stats from '@/components/Stats'

export default function () {
  const { activePortfolio } = usePortfolio()
  const { userPortfolioItems } = usePortfolioItem()
  const { data: userAssets } = usePortfolioAssets()

  return (
    <div className="flex h-full">
      {activePortfolio && (
        <PortfolioItemProvider>
          <PortfolioAssetsProvider>
            <Sidebar />
            {(userPortfolioItems || userAssets) && <Stats />}
            {(!userPortfolioItems || !userAssets) && (
              <div className="flex w-4/5 justify-center text-xl">
                <p>Nothing to show. Add assets to your portfolio</p>
              </div>
            )}
          </PortfolioAssetsProvider>
        </PortfolioItemProvider>
      )}
    </div>
  )
}
