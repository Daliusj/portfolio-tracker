import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import ChartBox from '@/components/ChartBox/ChartBox'
import TableBox from '@/components/TableBox/TableBox'
import { PortfolioProvider } from '@/context/PortfolioContext'
import { PortfolioAssetsProvider } from '@/context/portfolioAssets'
import { PortfolioItemProvider } from '@/context/PortfolioItemContext'

export default function Home() {
  return (
    <PortfolioProvider>
      <PortfolioItemProvider>
        <PortfolioAssetsProvider>
          <div className="flex h-full w-full space-x-56">
            <Sidebar />
            <div className="w-3/5 flex-col items-center justify-center">
              <div className="mb-6 h-fit">
                <ChartBox />
              </div>
              <div className="mb-6 h-fit">
                <TableBox />
              </div>
            </div>
          </div>
        </PortfolioAssetsProvider>
      </PortfolioItemProvider>
    </PortfolioProvider>
  )
}
