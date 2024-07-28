import React from 'react'
import Sidebar from '../components/Sidebar'
import ChartBox from '@/components/ChartBox/ChartBox'
import TableBox from '@/components/TableBox/TableBox'

export default function Home() {
  return (
    <div>
      <div className="flex">
        <Sidebar></Sidebar>
        <div>
          <ChartBox />
        </div>
      </div>
      <TableBox />
    </div>
  )
}
