import React from 'react'
import { Sidebar as SidebarFlowbite } from 'flowbite-react'
import { usePortfolioAssets } from '@/context/portfolioAssets'
import { FullPortfolioGroupedPublic } from '@server/shared/types'
import TreeGroup from './TreeGroup'

export default function AssetsTree() {
  const { data } = usePortfolioAssets()

  return (
    <div className="sidebar flex-col ">
      <SidebarFlowbite aria-label="Sidebar with multi-level dropdown" className="w-80">
        <SidebarFlowbite.Items>
          {data && <TreeGroup data={data as FullPortfolioGroupedPublic[]} type="stock" />}
          {data && <TreeGroup data={data as FullPortfolioGroupedPublic[]} type="fund" />}
          {data && <TreeGroup data={data as FullPortfolioGroupedPublic[]} type="crypto" />}
        </SidebarFlowbite.Items>
      </SidebarFlowbite>
    </div>
  )
}
