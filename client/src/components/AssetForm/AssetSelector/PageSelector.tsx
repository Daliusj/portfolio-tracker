import React from 'react'
import { Button } from 'flowbite-react'

type CustomPaginationProps = {
  currentPage: number
  totalPages: number
  totalEntries: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function PageSelector({
  currentPage,
  totalPages,
  totalEntries,
  itemsPerPage,
  onPageChange,
}: CustomPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const startEntry = (currentPage - 1) * itemsPerPage + 1
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries)

  return (
    <div className="mt-4 flex flex-col items-center space-y-2">
      <div className="text-sm text-gray-700 dark:text-white">
        Showing {startEntry} to {endEntry} of {totalEntries} Entries
      </div>
      <div className="flex items-center space-x-2">
        <Button.Group className="custom-button-group">
          <Button
            color="blue"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="first-button"
          >
            Previous
          </Button>
          <Button
            color="blue"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="last-button"
          >
            Next
          </Button>
        </Button.Group>
      </div>
    </div>
  )
}
