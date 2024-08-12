import React from 'react'
import { Sidebar as SidebarFlowbite, Button } from 'flowbite-react'
import { HiBell, HiTrendingUp, HiOutlineDotsVertical } from 'react-icons/hi'
import { usePortfolioAssets } from '@/context/portfolioAssets'

export default function () {
  const { data } = usePortfolioAssets()
  const filterAssetType = () => {}

  return (
    <div className="sidebar flex-col ">
      <SidebarFlowbite aria-label="Sidebar with multi-level dropdown" className="w-80">
        <SidebarFlowbite.Items>
          <SidebarFlowbite.ItemGroup>
            <div className="flex justify-between">
              <SidebarFlowbite.Item
                className="pl-8"
                icon={HiTrendingUp}
                label="+5.78%"
                labelColor="green"
              >
                Stocks
              </SidebarFlowbite.Item>
              <div className="w-12 "></div>
            </div>

            {data?.map((asset) => (
              <SidebarFlowbite.Item className="w-full pl-12" key={asset.id}>
                <div className="flex justify-between">
                  <p className="w-full whitespace-normal break-words">{asset.name}</p>
                  <span className="ml-4 text-red-500">-1.23</span>
                </div>
              </SidebarFlowbite.Item>
            ))}
          </SidebarFlowbite.ItemGroup>
        </SidebarFlowbite.Items>
      </SidebarFlowbite>
    </div>
  )
}
