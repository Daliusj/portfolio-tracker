import React, { ReactNode, createContext, useContext, useEffect } from 'react'
import { FullPortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'
import { usePortfolioItem } from './PortfolioItemContext'

type PortfolioAssetsContext = {
  data: FullPortfolioPublic[] | undefined
}

type PortfolioAssetsProviderProps = {
  children: ReactNode
}

const defaultPortfolioContext: PortfolioAssetsContext = {
  data: undefined,
}

const PortfolioAssetsContext = createContext<PortfolioAssetsContext>(defaultPortfolioContext)

export const PortfolioAssetsProvider = ({ children }: PortfolioAssetsProviderProps) => {
  const { activePortfolio } = usePortfolio()
  const { activePortfolioItem } = usePortfolioItem()

  const { data, isLoading, error, refetch } = trpc.portfolio.getFull.useQuery(
    { id: activePortfolio?.id || 0 },
    {
      enabled: !!activePortfolio,
    }
  )

  useEffect(() => {
    refetch()
  }, [activePortfolioItem])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioAssetsContext.Provider value={{ data }}>{children}</PortfolioAssetsContext.Provider>
  )
}

export const usePortfolioAssets = () => useContext(PortfolioAssetsContext)
