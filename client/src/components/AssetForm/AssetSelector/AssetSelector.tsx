import { TextInput, Button } from 'flowbite-react'
import React, { useState, useEffect } from 'react'
import AssetsTable from './AssetTables/AssetsTable'
import { trpc } from '@/trpc'
import { HiSearch } from 'react-icons/hi'
import { AssetPublic } from '@server/shared/types'
import PageSelector from './PageSelector'

type AssetSearchProps = {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedAsset: AssetPublic | undefined
  setSelectedAsset: React.Dispatch<React.SetStateAction<AssetPublic | undefined>>
}

export default function ({
  searchQuery,
  setSearchQuery,
  selectedAsset,
  setSelectedAsset,
}: AssetSearchProps) {
  const [allowQuery, setAllowQuery] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const ITEMS_PER_PAGE = 5

  const assetsQuery = trpc.asset.get.useQuery(
    { query: searchQuery, offset: (currentPage - 1) * ITEMS_PER_PAGE, limit: ITEMS_PER_PAGE },
    { enabled: searchQuery.length > 2 && allowQuery }
  )

  useEffect(() => {
    if (assetsQuery.data) {
      setTotalPages(Math.ceil(assetsQuery.data.total / ITEMS_PER_PAGE))
    }
  }, [assetsQuery.data])

  const handleSearchButton = () => {
    setAllowQuery(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchButton()
    }
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllowQuery(false)
    setSearchQuery(event.target.value)
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <div className="flex">
        <TextInput
          id="search-query"
          placeholder="Stock name"
          value={searchQuery}
          onKeyDown={handleKeyDown}
          onChange={handleSearchInputChange}
          required
        />
        <Button color="blue" onClick={handleSearchButton}>
          <HiSearch size={22} />
        </Button>
      </div>
      {assetsQuery.data && (
        <AssetsTable
          assets={assetsQuery.data?.data}
          setSelectedAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
        />
      )}
      <div className="flex overflow-x-auto sm:justify-center">
        {assetsQuery.data && (
          <PageSelector
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalEntries={assetsQuery.data.total}
          />
        )}
      </div>
    </div>
  )
}
