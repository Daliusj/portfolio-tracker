import React, { useState } from 'react'
import { Button } from 'flowbite-react'
import AssetForm from '@/components/AssetForm/AssetForm'
import PortfolioSelector from './PortfolioSelector'
import AssetsTree from './AssetsTree/AssetsTree'

export default function Sidebar() {
  const [openAssetModal, setOpenAssetModal] = useState(false)

  return (
    <div className="sidebar w-full flex-col items-center justify-center">
      <div className=" rounded-lg bg-slate-800">
        <PortfolioSelector />
      </div>
      <Button className="w-full bg-orange-600" onClick={() => setOpenAssetModal(true)}>
        <span className="text-sm">Add Asset</span>
      </Button>
      <AssetForm openModal={openAssetModal} setOpenModal={setOpenAssetModal} mode="create" />
      <AssetsTree />
    </div>
  )
}
