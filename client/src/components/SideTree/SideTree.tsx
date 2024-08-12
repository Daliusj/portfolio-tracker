import React, { useState } from 'react'
import { Sidebar as SidebarFlowbite, Button, Dropdown, CustomFlowbiteTheme } from 'flowbite-react'
import {
  HiBell,
  HiBriefcase,
  HiTrendingUp,
  HiOutlineDotsVertical,
  HiCurrencyDollar,
  HiDotsVertical,
} from 'react-icons/hi'
import PortfolioForm from '@/components/PortfolioForm/PortfolioForm'
import AssetForm from '@/components/AssetForm/AssetForm'
import { usePortfolio } from '@/context/PortfolioContext'
import PortfolioSelector from './PortfolioSelector'

type Props = {
  logoUrl: string
  name: string
  valueChange: number
}

export default function ({ logoUrl, name, valueChange }: Props) {
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false)
  const [openAssetModal, setOpenAssetModal] = useState(false)

  return (
    <div className="sidebar flex-col ">
      <PortfolioSelector />
      <AssetForm openModal={openAssetModal} setOpenModal={setOpenAssetModal} />
      <SidebarFlowbite aria-label="Sidebar with multi-level dropdown" className="w-80">
        <SidebarFlowbite.Items>
          <SidebarFlowbite.ItemGroup>
            <div className="flex justify-between">
              <SidebarFlowbite.Item
                className="font-body text-lg"
                icon={HiBriefcase}
                label="+5.78%"
                labelColor="green"
              >
                Portfolio One
              </SidebarFlowbite.Item>
              <Button>
                <HiOutlineDotsVertical />
              </Button>
            </div>

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
      <Button className="bg-orange-600" onClick={() => setOpenAssetModal(true)}>
        <HiCurrencyDollar className="mr-3 h-4 w-4" />
        Add Asset
      </Button>
    </div>
  )
}
