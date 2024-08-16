import PortfolioForm from '@/components/PortfolioForm/PortfolioForm'
import { usePortfolio } from '@/context/PortfolioContext'
import React from 'react'

export default function () {
  const { activePortfolio } = usePortfolio()
  return (
    <div className="flex justify-center">
      <div className="w-96">
        {!activePortfolio && (
          <PortfolioForm mode="new" disableClose={true} modalMode={false} first={true} />
        )}
      </div>
    </div>
  )
}
