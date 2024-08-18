import { FullPortfolioGroupedPublic } from '@server/shared/types'
import React from 'react'
import { Sidebar as SidebarFlowbite } from 'flowbite-react'
import { HiTrendingUp } from 'react-icons/hi'
import DropdownMenu from './DropdownMenu'
import ProfitLoss from '@/components/ProfitLoss'
import { useStats } from '@/context/StatsContex'

type TreeGroupProps = {
  data: FullPortfolioGroupedPublic[]
  type: string
}

export default function TreeGroup({ data, type }: TreeGroupProps) {
  const { assetsStats } = useStats()

  const filterAssetType = (assets: FullPortfolioGroupedPublic[], type: string) =>
    assets.filter((asset) => asset.assetType === type)

  return (
    <SidebarFlowbite.ItemGroup>
      <div className="flex justify-between">
        <SidebarFlowbite.Item icon={HiTrendingUp} labelColor="green">
          {`${type.toUpperCase()}S`}
        </SidebarFlowbite.Item>
        <div className="w-12 "></div>
      </div>

      {data &&
        filterAssetType(data, type)?.map((asset) => (
          <SidebarFlowbite.Item
            className="flex w-full items-center justify-center pl-8"
            key={asset.assetId}
          >
            <div className="flex w-full max-w-xs items-center justify-between">
              <p className="whitespace-normal break-words">{asset.assetName}</p>
              <div className="flex">
                {assetsStats && assetsStats.find((stats) => stats.assetId === asset.assetId) && (
                  <ProfitLoss
                    asset={assetsStats.find((stats) => stats.assetId === asset.assetId)!}
                    full={false}
                    flat={false}
                  />
                )}
                <DropdownMenu asset={asset} />
              </div>
            </div>
          </SidebarFlowbite.Item>
        ))}
    </SidebarFlowbite.ItemGroup>
  )
}
