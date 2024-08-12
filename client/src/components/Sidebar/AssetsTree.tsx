import React from 'react'
import { Sidebar as SidebarFlowbite, Button } from 'flowbite-react'
import { HiBell, HiTrendingUp, HiOutlineDotsVertical } from 'react-icons/hi'

export default function () {
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

            <div className="flex justify-between">
              <SidebarFlowbite.Item className="pl-12" icon={HiBell} label="-1.23%" labelColor="red">
                Wallmart
              </SidebarFlowbite.Item>
              <Button>
                <HiOutlineDotsVertical />
              </Button>
            </div>
          </SidebarFlowbite.ItemGroup>
        </SidebarFlowbite.Items>
      </SidebarFlowbite>
    </div>
  )
}
