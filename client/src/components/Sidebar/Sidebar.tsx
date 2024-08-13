import React, { useState } from 'react'
import { Button } from 'flowbite-react'
import AssetForm from '@/components/AssetForm/AssetForm'
import PortfolioSelector from './PortfolioSelector'
import AssetsTree from './AssetsTree/AssetsTree'

export default function () {
  const [openAssetModal, setOpenAssetModal] = useState(false)

  return (
    <div className="sidebar flex-col ">
      <div className="flex">
        <Button className="bg-orange-600" onClick={() => setOpenAssetModal(true)}>
          Add Asset
        </Button>

        <PortfolioSelector />
      </div>
      <AssetForm openModal={openAssetModal} setOpenModal={setOpenAssetModal} mode="create" />
      <AssetsTree />
    </div>
  )
}
