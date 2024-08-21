import { Modal } from 'flowbite-react'
import React from 'react'
import Form from './Form'

type PortfolioFormProps = {
  mode: 'new' | 'edit'
  openModal?: boolean
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  disableClose?: boolean
  modalMode?: boolean
  first: boolean
}

export default function PortfolioForm({
  openModal,
  setOpenModal,
  mode,
  disableClose,
  modalMode,
  first,
}: PortfolioFormProps) {
  const onCloseModal = () => {
    setOpenModal && setOpenModal(false)
  }

  return (
    <div>
      {modalMode ? (
        <Modal show={openModal} size="md" onClose={modalMode && onCloseModal} popup>
          {!disableClose ? (
            <Modal.Header />
          ) : (
            <div className="flex h-[32px] items-start justify-between rounded-t border-b-0 p-2 dark:border-gray-600"></div>
          )}
          <Modal.Body>
            <Form mode={mode} setOpenModal={setOpenModal} />
          </Modal.Body>
        </Modal>
      ) : (
        <Form mode={mode} />
      )}
    </div>
  )
}
