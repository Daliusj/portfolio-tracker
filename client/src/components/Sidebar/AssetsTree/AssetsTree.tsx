import React from 'react'
import { Sidebar as SidebarFlowbite } from 'flowbite-react'
import { usePortfolioAssets } from '@/context/portfolioAssets'
import { usePortfolioItem } from '@/context/PortfolioItemContext'
import { FullPortfolioGroupedPublic, FullPortfolioPublic } from '@server/shared/types'
import TreeGroup from './TreeGroup'

export default function () {
  const { data } = usePortfolioAssets()

  const { setActivePortfolioItem } = usePortfolioItem()

  const filterAssetType = (
    assets: FullPortfolioPublic[] | FullPortfolioGroupedPublic[],
    type: string
  ) => assets.filter((asset) => asset.assetType === type)

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
