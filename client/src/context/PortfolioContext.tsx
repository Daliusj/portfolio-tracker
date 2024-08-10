import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { PortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'

type PortfolioContextType = {
  userPortfolios: PortfolioPublic[] | undefined
  activePortfolio: PortfolioPublic | undefined

  setActivePortfolio: React.Dispatch<React.SetStateAction<PortfolioPublic | undefined>>
}

type PortfolioProviderProps = {
  children: ReactNode
}

const defaultPortfolioContext: PortfolioContextType = {
  userPortfolios: undefined,
  activePortfolio: undefined,
  setActivePortfolio: () => {},
}

const PortfolioContext = createContext<PortfolioContextType>(defaultPortfolioContext)

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [activePortfolio, setActivePortfolio] = useState<PortfolioPublic | undefined>(undefined)
  const [hasInitialized, setHasInitialized] = useState(false)

  const portfoliosQuery = trpc.portfolio.get.useQuery()
  const userPortfolios = portfoliosQuery.data

  useEffect(() => {
    if (userPortfolios && !hasInitialized) {
      setActivePortfolio(userPortfolios[0])
      setHasInitialized(true)
    }
  }, [portfoliosQuery])

  if (!hasInitialized) {
    return <div>Loading...</div>
  }
  return (
    <PortfolioContext.Provider value={{ userPortfolios, activePortfolio, setActivePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)
