import React from 'react'
import TableBox from '@/components/TableBox/TableBox'
import { usePortfolioItem } from '@/context/PortfolioItemContext'

export default function Stats() {
  const { userPortfolioItems } = usePortfolioItem()

  return (
    <div className="stats">
      {userPortfolioItems?.length ? (
        <TableBox />
      ) : (
        <div className="flex h-3/5 w-full items-center justify-center text-xl text-slate-900 dark:text-slate-300 ">
          <p>Nothing to show. Add assets to your portfolio</p>
        </div>
      )}
    </div>
  )
}
