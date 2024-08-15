import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import ChartBox from '@/components/ChartBox/ChartBox'
import { PortfolioProvider } from '@/context/PortfolioContext'
import { PortfolioAssetsProvider } from '@/context/portfolioAssets'
import { PortfolioItemProvider } from '@/context/PortfolioItemContext'
import TableBox from '@/components/TableBox/TableBox'
import { PortfolioStatsProvider } from '@/context/StatsContex'

export default function Home() {
  return (
    <PortfolioProvider>
      <PortfolioItemProvider>
        <PortfolioAssetsProvider>
          <PortfolioStatsProvider>
            <div className="flex h-full">
              <Sidebar />

              <div className="flex w-full flex-col items-center">
                {/* <div className="mb-6 h-fit">
                <ChartBox />
              </div> */}
                <div className="mb-6 w-4/5">
                  <TableBox />
                </div>
              </div>
            </div>
          </PortfolioStatsProvider>
        </PortfolioAssetsProvider>
      </PortfolioItemProvider>
    </PortfolioProvider>
  )
}
