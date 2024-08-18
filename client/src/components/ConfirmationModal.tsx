import React from 'react'
import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

type ConfirmationModalProps = {
  name: string
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  onConfirm: () => void
}

export default function ConfirmationModal({
  name,
  openModal,
  setOpenModal,
  onConfirm,
}: ConfirmationModalProps) {
  const handleYesButton = () => {
    onConfirm()
    setOpenModal(false)
  }

  return (
    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {`Are you sure you want to delete this ${name}?`}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={() => handleYesButton()}>
              Yes
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              No
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
