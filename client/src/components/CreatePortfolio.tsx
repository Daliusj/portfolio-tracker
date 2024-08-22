import PortfolioForm from '@/components/PortfolioForm/PortfolioForm'
import { usePortfolio } from '@/context/PortfolioContext'
import React from 'react'

export default function createPortfolio() {
  const { activePortfolio } = usePortfolio()
  return (
    <div className="m-5 flex justify-center">
      <div className="w-96">
        {!activePortfolio && (
          <PortfolioForm mode="new" disableClose={true} modalMode={false} first={true} />
        )}
      </div>
    </div>
  )
}
