import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import ChartBox from '@/components/ChartBox/ChartBox'
import TableBox from '@/components/TableBox/TableBox'
import { PortfolioProvider } from '@/context/PortfolioContext'

export default function Home() {
  return (
    <PortfolioProvider>
      <div>
        <div className="flex justify-between">
          <Sidebar></Sidebar>
          <div>
            <ChartBox />
          </div>
        </div>
        <TableBox />
      </div>
    </PortfolioProvider>
  )
}
