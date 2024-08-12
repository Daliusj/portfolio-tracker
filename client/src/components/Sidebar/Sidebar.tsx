import React, { useState } from 'react'
import { Button } from 'flowbite-react'
import AssetForm from '@/components/AssetForm/AssetForm'
import PortfolioSelector from './PortfolioSelector'
import AssetsTree from './AssetsTree'

export default function () {
  const [openAssetModal, setOpenAssetModal] = useState(false)

  return (
    <div className="sidebar flex-col ">
      <PortfolioSelector />
      <AssetForm openModal={openAssetModal} setOpenModal={setOpenAssetModal} />
      <AssetsTree />
      <Button className="bg-orange-600" onClick={() => setOpenAssetModal(true)}>
        Add Asset
      </Button>
    </div>
  )
}
