import AssetForm from '@/components/AssetForm/AssetForm'
import { FullPortfolioGroupedPublic } from '@server/shared/types'
import { Dropdown } from 'flowbite-react'
import React, { useState } from 'react'
import { HiOutlinePencilAlt } from 'react-icons/hi'

type DropdownMenuProps = {
  asset: FullPortfolioGroupedPublic
}

export default function DropdownMenu({ asset }: DropdownMenuProps) {
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
    <div className="flex w-full justify-end">
      <Dropdown
        label={<HiOutlinePencilAlt size={'18'} className="text-slate-900 dark:text-slate-300" />}
        arrowIcon={false}
      >
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
