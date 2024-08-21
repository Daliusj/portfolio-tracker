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
        <SidebarFlowbite.Item icon={HiTrendingUp}>
          <div className="text-xs">{`${type.toUpperCase()}S`}</div>
        </SidebarFlowbite.Item>
      </div>

      {data &&
        filterAssetType(data, type)?.map((asset) => (
          <SidebarFlowbite.Item className="flex w-full items-center" key={asset.assetId}>
            <div className="flex w-full items-center justify-between">
              <p className="whitespace-normal break-words text-sm">{asset.assetName}</p>
              <div className="jusify-center flex-col items-center">
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
