import React, { useState } from 'react'
import { Sidebar as SidebarFlowbite, Button } from 'flowbite-react'
import { HiBell, HiBriefcase, HiTrendingUp } from 'react-icons/hi'
import PortfolioForm from '@/context/PortfolioForm/PortfolioForm'

type Props = {
  logoUrl: string
  name: string
  valueChange: number
}

export default function ({ logoUrl, name, valueChange }: Props) {
  return (
    <div className="sidebar">
      <PortfolioForm />
      <SidebarFlowbite aria-label="Sidebar with multi-level dropdown">
        <SidebarFlowbite.Items>
          <SidebarFlowbite.ItemGroup>
            <SidebarFlowbite.Item
              className="font-body text-lg"
              icon={HiBriefcase}
              label="+5.78%"
              labelColor="green"
            >
              Portfolio One
            </SidebarFlowbite.Item>
            <SidebarFlowbite.Item
              className="pl-8"
              icon={HiTrendingUp}
              label="+5.78%"
              labelColor="green"
            >
              Stocks
            </SidebarFlowbite.Item>
            <SidebarFlowbite.Item className="pl-12" icon={HiBell} label="-1.23%" labelColor="red">
              Wallmart
            </SidebarFlowbite.Item>
          </SidebarFlowbite.ItemGroup>
        </SidebarFlowbite.Items>
      </SidebarFlowbite>
    </div>
  )
}
