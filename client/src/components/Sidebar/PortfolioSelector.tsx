import { Dropdown } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { usePortfolio } from '@/context/PortfolioContext'
import { HiMenu } from 'react-icons/hi'
import PortfolioForm from '../PortfolioForm/PortfolioForm'
import ConfirmationModal from '../ConfirmationModal'

export default function () {
  const userPortfolios = usePortfolio()
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [portfolioFormMode, setPortfolioFormMode] = useState<'new' | 'edit'>('new')
  const [disableClosePortfolioForm, setDisableClosePortfolioForm] = useState(false)

  const handleCreateNewButton = () => {
    setOpenPortfolioModal(true)
    setPortfolioFormMode('new')
  }

  const handleEditButton = () => {
    setOpenPortfolioModal(true)
    setPortfolioFormMode('edit')
  }

  const handleDeleteButton = () => {
    setOpenConfirmationModal(true)
  }

  const deletePortfolio = () => {
    userPortfolios.activePortfolio?.id &&
      userPortfolios.remove({ id: userPortfolios.activePortfolio?.id })
  }

  return (
    <div className="flex">
      <Dropdown color="dark" label={userPortfolios.activePortfolio?.name} dismissOnClick={true}>
        {userPortfolios.userPortfolios?.map((portfolio) => (
          <Dropdown.Item
            onClick={() => userPortfolios.setActivePortfolio(portfolio)}
            key={portfolio.id}
          >
            {portfolio.name}
          </Dropdown.Item>
        ))}
      </Dropdown>

      <Dropdown label={<HiMenu />} arrowIcon={false}>
        <Dropdown.Item onClick={() => handleCreateNewButton()}>Create new</Dropdown.Item>
        <Dropdown.Item onClick={() => handleEditButton()}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => handleDeleteButton()}>Delete</Dropdown.Item>
      </Dropdown>
      <PortfolioForm
        openModal={openPortfolioModal}
        setOpenModal={setOpenPortfolioModal}
        mode={portfolioFormMode}
        disableClose={disableClosePortfolioForm}
        modalMode={true}
      />
      <ConfirmationModal
        name={userPortfolios.activePortfolio?.name || 'portfolio'}
        openModal={openConfirmationModal}
        setOpenModal={setOpenConfirmationModal}
        onConfirm={deletePortfolio}
      />
    </div>
  )
}
