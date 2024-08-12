import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { BaseCurrency, PortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'

type PortfolioContextType = {
  userPortfolios: PortfolioPublic[] | undefined
  activePortfolio: PortfolioPublic | undefined
  setActivePortfolio: React.Dispatch<React.SetStateAction<PortfolioPublic | undefined>>
  update: ({ id, name, currencySymbol }: PortfolioUpdate) => void
  create: ({ name, currencySymbol }: PortfolioCreate) => void
  remove: (id: PortfolioRemove) => void
}

type PortfolioPublicWithCurrency = Omit<PortfolioPublic, 'currencySymbol'> & {
  currencySymbol: BaseCurrency
}
type PortfolioUpdate = Pick<PortfolioPublicWithCurrency, 'id' | 'name' | 'currencySymbol'>
type PortfolioCreate = Pick<PortfolioPublicWithCurrency, 'name' | 'currencySymbol'>
type PortfolioRemove = Pick<PortfolioPublic, 'id'>

type PortfolioProviderProps = {
  children: ReactNode
}

const defaultPortfolioContext: PortfolioContextType = {
  userPortfolios: undefined,
  activePortfolio: undefined,
  setActivePortfolio: () => {},
  update: () => {},
  create: () => {},
  remove: () => {},
}

const PortfolioContext = createContext<PortfolioContextType>(defaultPortfolioContext)

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [activePortfolio, setActivePortfolio] = useState<PortfolioPublic | undefined>(undefined)
  const [userPortfolios, setUserPortfolios] = useState<PortfolioPublic[] | undefined>(undefined)
  const [hasLoaded, setHasLoaded] = useState(false)

  const portfoliosQuery = trpc.portfolio.get.useQuery(undefined, {
    enabled: hasLoaded,
    onSuccess: (data) => {
      setUserPortfolios(data.sort((a, b) => a.id - b.id))
      setActivePortfolio(data[0])
    },
  })

  const portfolioMutation = {
    create: trpc.portfolio.create.useMutation(),
    update: trpc.portfolio.update.useMutation(),
    remove: trpc.portfolio.remove.useMutation(),
  }

  const refetchPortfolios = () => {
    portfoliosQuery.refetch().then(() => setHasLoaded(true))
  }

  const update = ({ id, name, currencySymbol }: PortfolioUpdate) => {
    portfolioMutation.update.mutate(
      {
        id,
        name,
        currencySymbol,
      },
      {
        onSuccess: refetchPortfolios,
        onError: (error) => {
          console.error('Profile update', error)
        },
      }
    )
  }

  const create = ({ name, currencySymbol }: PortfolioCreate) => {
    portfolioMutation.create.mutate(
      {
        name,
        currencySymbol,
      },
      {
        onSuccess: refetchPortfolios,
        onError: (error) => {
          console.error('Profile create failed', error)
        },
      }
    )
  }

  const remove = (id: PortfolioRemove) => {
    portfolioMutation.remove.mutate(id, {
      onSuccess: refetchPortfolios,
      onError: (error) => {
        console.error('Profile remove failed', error)
      },
    })
  }

  useEffect(() => {
    if (!hasLoaded) {
      refetchPortfolios()
    }
  }, [hasLoaded])

  if (!hasLoaded) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioContext.Provider
      value={{ userPortfolios, activePortfolio, setActivePortfolio, update, create, remove }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)
