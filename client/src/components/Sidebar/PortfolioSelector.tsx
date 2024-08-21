import { Dropdown } from 'flowbite-react'
import React, { useState } from 'react'
import { usePortfolio } from '@/context/PortfolioContext'
import { HiOutlinePencilAlt } from 'react-icons/hi'
import PortfolioForm from '../PortfolioForm/PortfolioForm'
import ConfirmationModal from '../ConfirmationModal'

export default function PortfolioSelector() {
  const userPortfolios = usePortfolio()
  const [openPortfolioModal, setOpenPortfolioModal] = useState(false)
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [portfolioFormMode, setPortfolioFormMode] = useState<'new' | 'edit'>('new')

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

  const customTheme = {
    arrowIcon: 'ml-2 h-4 w-4',
    content: 'py-1 focus:outline-none',
    floating: {
      animation: 'transition-opacity',
      arrow: {
        base: 'absolute z-10 h-2 w-2 rotate-45',
        style: {
          dark: 'bg-gray-900 dark:bg-gray-700',
          light: 'bg-white',
          auto: 'bg-white dark:bg-gray-700',
        },
        placement: '-4px',
      },
      base: 'z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none',
      content: 'py-1 text-sm text-gray-700 dark:text-gray-200',
      divider: 'my-1 h-px bg-gray-100 dark:bg-gray-600',
      header: 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
      hidden: 'invisible opacity-0',
      item: {
        container: '',
        base: 'flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white',
        icon: 'mr-2 h-4 w-4',
      },
      style: {
        dark: 'bg-gray-900 text-white dark:bg-gray-700',
        light: 'border border-gray-200 bg-white text-gray-900',
        auto: 'border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white',
      },
      target: 'w-full',
    },
    inlineWrapper: 'flex items-center',
  }

  return (
    <div className="mb-1 flex">
      <div className="flex h-11 w-full justify-center">
        <Dropdown
          color="dark"
          label={
            <span className="h-11 w-full truncate">{userPortfolios.activePortfolio?.name}</span>
          }
          theme={customTheme}
          dismissOnClick={true}
        >
          {userPortfolios.userPortfolios?.map((portfolio) => (
            <Dropdown.Item
              onClick={() => userPortfolios.setActivePortfolio(portfolio)}
              key={portfolio.id}
            >
              {portfolio.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <div className="h-11">
        <Dropdown
          color="dark"
          data-testid="portfolio-menu"
          label={
            <div className="block h-5 w-2">
              <HiOutlinePencilAlt size={18} />
            </div>
          }
          arrowIcon={false}
        >
          <Dropdown.Item onClick={() => handleCreateNewButton()}>Create new</Dropdown.Item>
          <Dropdown.Item onClick={() => handleEditButton()}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDeleteButton()}>Delete</Dropdown.Item>
        </Dropdown>
      </div>
      <PortfolioForm
        openModal={openPortfolioModal}
        setOpenModal={setOpenPortfolioModal}
        mode={portfolioFormMode}
        modalMode={true}
        first={false}
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
