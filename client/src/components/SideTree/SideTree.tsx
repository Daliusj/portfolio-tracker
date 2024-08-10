import React, { useState } from 'react'
import { Sidebar as SidebarFlowbite, Button, Dropdown } from 'flowbite-react'
import {
  HiBell,
  HiBriefcase,
  HiTrendingUp,
  HiOutlineDotsVertical,
  HiUserCircle,
  HiCurrencyDollar,
} from 'react-icons/hi'
import PortfolioForm from './PortfolioForm/PortfolioForm'
import AssetForm from './AssetForm/AssetForm'
import { usePortfolio } from '@/context/PortfolioContext'

type Props = {
  logoUrl: string
  name: string
  valueChange: number
}

export default function ({ logoUrl, name, valueChange }: Props) {
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false)
  const [openAssetModal, setOpenAssetModal] = useState(false)
  const userPortfolios = usePortfolio()

  return (
    <div className="sidebar flex-col ">
      <div className="flex-col">
        <Dropdown color="blue" label={userPortfolios.activePortfolio?.name} dismissOnClick={true}>
          {userPortfolios.userPortfolios?.map((portfolio) => (
            <Dropdown.Item
              onClick={() => userPortfolios.setActivePortfolio(portfolio)}
              key={portfolio.id}
            >
              {portfolio.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
        <Button color="blue" onClick={() => setOpenPortfolioModal(true)}>
          <HiUserCircle className="mr-3 h-4 w-4" />
          Create Portfolio
        </Button>
        <Button color="blue" onClick={() => setOpenAssetModal(true)}>
          <HiCurrencyDollar className="mr-3 h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <PortfolioForm openModal={openPortfolioModal} setOpenModal={setOpenPortfolioModal} />
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
    </div>
  )
}
