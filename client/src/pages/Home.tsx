import React, { useEffect, useState } from 'react'
import Sidebar from '../components/SideTree'
import ChartBox from '@/components/ChartBox/ChartBox'
import TableBox from '@/components/TableBox/TableBox'
import { trpc } from '@/trpc'
import { PortfolioPublic } from '@server/shared/types'

export default function Home() {
  const [userPortfolios, setUserPortfolios] = useState<PortfolioPublic[]>()

  return (
    <div>
      <div className="flex justify-between">
        <Sidebar logoUrl={'c'} name={'aaa'} valueChange={4}></Sidebar>
        <div>
          <ChartBox />
        </div>
      </div>
      <TableBox />
    </div>
  )
}
