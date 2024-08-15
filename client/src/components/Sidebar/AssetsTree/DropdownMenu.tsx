import AssetForm from '@/components/AssetForm/AssetForm'
import { FullPortfolioGroupedPublic } from '@server/shared/types'
import { Dropdown } from 'flowbite-react'
import React, { useState } from 'react'
import { HiAdjustments } from 'react-icons/hi'

type DropdownMenuProps = {
  asset: FullPortfolioGroupedPublic
}

export default function ({ asset }: DropdownMenuProps) {
  const [openAssetModal, setOpenAssetModal] = useState(false)
  const [mode, setMode] = useState<'edit' | 'createWithBase'>('edit')

  const handleAddButton = () => {
    setMode('createWithBase')
    setOpenAssetModal(true)
  }
  const handleEditButton = () => {
    setMode('edit')
    setOpenAssetModal(true)
  }

  return (
    <div>
      <Dropdown className="items-center" label={<HiAdjustments />} arrowIcon={false}>
        <Dropdown.Item onClick={() => handleAddButton()}>Add</Dropdown.Item>
        <Dropdown.Item onClick={() => handleEditButton()}>Edit</Dropdown.Item>
      </Dropdown>
      <AssetForm
        openModal={openAssetModal}
        setOpenModal={setOpenAssetModal}
        mode={mode}
        asset={asset}
      />
    </div>
  )
}
