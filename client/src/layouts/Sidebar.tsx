import React from 'react'
import { Sidebar as SidebarFlowbite } from 'flowbite-react'
import { HiCollection } from 'react-icons/hi'
import Asset from '../components/Asset'

export default function Sidebar() {
  const asset = {
    logo: 'LO',
    name: 'Wallmart',
    quantity: 5.46,
    symbol: 'WMT',
    price: '$69.76',
    totalValue: '€ 350.42',
    valueChange: '+52.97% ',
  }

  return (
    <div>
      <SidebarFlowbite aria-label="Sidebar with multi-level dropdown" className="box sidebar">
        <SidebarFlowbite.Items>
          <SidebarFlowbite.ItemGroup>
            <SidebarFlowbite.Collapse icon={HiCollection} label="Portfolio One">
              <SidebarFlowbite.Collapse icon={HiCollection} label="Stocks">
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>
              </SidebarFlowbite.Collapse>
              <SidebarFlowbite.Collapse icon={HiCollection} label="Funds">
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>{' '}
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>
              </SidebarFlowbite.Collapse>
              <SidebarFlowbite.Collapse icon={HiCollection} label="Crypto">
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>{' '}
                <SidebarFlowbite.Item>
                  <Asset asset={asset} />
                </SidebarFlowbite.Item>
              </SidebarFlowbite.Collapse>
            </SidebarFlowbite.Collapse>
          </SidebarFlowbite.ItemGroup>
        </SidebarFlowbite.Items>
      </SidebarFlowbite>
    </div>
  )
}
