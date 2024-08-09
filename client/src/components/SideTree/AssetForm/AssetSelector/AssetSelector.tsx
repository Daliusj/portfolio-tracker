import { TextInput, Button, Pagination } from 'flowbite-react'
import React, { useState } from 'react'
import AssetsTable from './AssetsTables/AssetsTable'
import { trpc } from '@/trpc'
import { HiSearch } from 'react-icons/hi'
import { AssetPublic } from '@server/shared/types'

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

  const assetsQuery = trpc.asset.get.useQuery(
    { query: searchQuery, offset: currentPage, limit: 5 },
    { enabled: searchQuery.length > 2 && allowQuery === true }
  )

  const handleSearchButton = () => {
    console.log(assetsQuery.data)
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

  const onPageChange = (page: number) => setCurrentPage(page)
  return (
    <div>
      <div className="flex ">
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
      <AssetsTable
        assets={assetsQuery.data}
        setSelectedAsset={setSelectedAsset}
        selectedAsset={selectedAsset}
      />
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          layout="table"
          currentPage={currentPage}
          totalPages={5}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
