import React, { ReactNode, createContext, useContext, useEffect } from 'react'
import { AssetStatsPublic, PortfolioStatsPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'
import portfolio from '@server/controllers/portfolio'
import { usePortfolioAssets } from './portfolioAssets'

type PortfolioStatsContext = {
  assetsStats: AssetStatsPublic[] | undefined
  portfolioStats: PortfolioStatsPublic | undefined
}

type PortfolioStatsProviderProps = {
  children: ReactNode
}

const defaultPortfolioStatsContext: PortfolioStatsContext = {
  assetsStats: undefined,
  portfolioStats: undefined,
}

const PortfolioStatsContext = createContext<PortfolioStatsContext>(defaultPortfolioStatsContext)

export const PortfolioStatsProvider = ({ children }: PortfolioStatsProviderProps) => {
  const { activePortfolio } = usePortfolio()
  const { data: portfolioAssets } = usePortfolioAssets()

  const assetsStatsQuery = trpc.portfolioStats.getAssetsStats.useQuery(
    { id: activePortfolio?.id || 0 },
    {
      enabled: !!activePortfolio,
    }
  )

  const portfolioStatsQuery = trpc.portfolioStats.getPortfolioStats.useQuery(
    { id: activePortfolio?.id || 0 },
    {
      enabled: !!activePortfolio,
    }
  )

  useEffect(() => {
    assetsStatsQuery.refetch()
    portfolioStatsQuery.refetch()
  }, [activePortfolio, portfolioAssets])

  if (assetsStatsQuery.isLoading || portfolioStatsQuery.isLoading) {
    return <div>Loading...</div>
  }

  const assetsStats = assetsStatsQuery.data
  const portfolioStats = portfolioStatsQuery.data

  return (
    <PortfolioStatsContext.Provider value={{ assetsStats, portfolioStats }}>
      {children}
    </PortfolioStatsContext.Provider>
  )
}

export const useStats = () => useContext(PortfolioStatsContext)
