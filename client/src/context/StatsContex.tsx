import React, { ReactNode, createContext, useContext, useEffect } from 'react'
import { PortfolioStatsPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'

type PortfolioStatsContext = {
  data: PortfolioStatsPublic[] | undefined
}

type PortfolioStatsProviderProps = {
  children: ReactNode
}

const defaultPortfolioStatsContext: PortfolioStatsContext = {
  data: undefined,
}

const PortfolioStatsContext = createContext<PortfolioStatsContext>(defaultPortfolioStatsContext)

export const PortfolioStatsProvider = ({ children }: PortfolioStatsProviderProps) => {
  const { activePortfolio } = usePortfolio()

  const { data, isLoading, error, refetch } = trpc.portfolioStats.get.useQuery(
    { id: activePortfolio?.id || 0 },
    {
      enabled: !!activePortfolio,
    }
  )

  useEffect(() => {
    refetch()
  }, [activePortfolio])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioStatsContext.Provider value={{ data }}>{children}</PortfolioStatsContext.Provider>
  )
}

export const useStats = () => useContext(PortfolioStatsContext)
