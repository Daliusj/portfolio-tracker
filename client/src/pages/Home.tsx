import React from 'react'
import Sidebar from '../components/SideTree/SideTree'
import ChartBox from '@/components/ChartBox/ChartBox'
import TableBox from '@/components/TableBox/TableBox'
import { PortfolioProvider } from '@/context/PortfolioContext'

export default function Home() {
  return (
    <PortfolioProvider>
      <div>
        <div className="flex justify-between">
          <Sidebar logoUrl={'c'} name={'aaa'} valueChange={4}></Sidebar>
          <div>
            <ChartBox />
          </div>
        </div>
        <TableBox />
      </div>
    </PortfolioProvider>
  )
}
