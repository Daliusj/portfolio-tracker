import React, { ReactNode, createContext, useContext, useEffect } from 'react'
import { FullPortfolioGroupedPublic, FullPortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'
import { usePortfolioItem } from './PortfolioItemContext'

type PortfolioAssetsContext = {
  data: FullPortfolioPublic[] | FullPortfolioGroupedPublic[] | undefined
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
  const { activePortfolioItem, userPortfolioItems } = usePortfolioItem()

  const { data, isLoading, error, refetch } = trpc.portfolio.getFull.useQuery(
    { id: activePortfolio?.id || 0, group: true },
    {
      enabled: !!activePortfolio,
    }
  )

  useEffect(() => {
    activePortfolio && refetch()
  }, [activePortfolioItem, userPortfolioItems])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioAssetsContext.Provider value={{ data }}>{children}</PortfolioAssetsContext.Provider>
  )
}

export const usePortfolioAssets = () => useContext(PortfolioAssetsContext)
