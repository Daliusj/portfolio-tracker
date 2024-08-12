import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { BaseCurrency, PortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'

type PortfolioContext = {
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

const defaultPortfolioContext: PortfolioContext = {
  userPortfolios: undefined,
  activePortfolio: undefined,
  setActivePortfolio: () => {},
  update: () => {},
  create: () => {},
  remove: () => {},
}

const PortfolioContext = createContext<PortfolioContext>(defaultPortfolioContext)

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [activePortfolio, setActivePortfolio] = useState<PortfolioPublic | undefined>(undefined)
  const [userPortfolios, setUserPortfolios] = useState<PortfolioPublic[] | undefined>(undefined)
  const [hasLoaded, setHasLoaded] = useState(false)

  const portfoliosQuery = trpc.portfolio.get.useQuery()

  const portfolioMutation = {
    create: trpc.portfolio.create.useMutation(),
    update: trpc.portfolio.update.useMutation(),
    remove: trpc.portfolio.remove.useMutation(),
  }

  const update = ({ id, name, currencySymbol }: PortfolioUpdate) => {
    portfolioMutation.update.mutate(
      {
        id,
        name,
        currencySymbol,
      },
      {
        onSuccess: (updatedPortfolio) => {
          setUserPortfolios((prevPortfolios) =>
            prevPortfolios?.map((portfolio) =>
              portfolio.id === id ? { ...portfolio, name, currencySymbol } : portfolio
            )
          )
          if (activePortfolio?.id === id) {
            setActivePortfolio((prev) => (prev ? { ...prev, name, currencySymbol } : prev))
          }
          portfoliosQuery.refetch()
        },
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
        onSuccess: (newPortfolio) => {
          setUserPortfolios((prevPortfolios) =>
            prevPortfolios ? [...prevPortfolios, newPortfolio] : [newPortfolio]
          )
          setActivePortfolio(newPortfolio)
          portfoliosQuery.refetch()
        },
        onError: (error) => {
          console.error('Profile create failed', error)
        },
      }
    )
  }

  const remove = (idObj: PortfolioRemove) => {
    const { id } = idObj
    portfolioMutation.remove.mutate(idObj, {
      onSuccess: () => {
        setUserPortfolios((prevPortfolios) =>
          prevPortfolios?.filter((portfolio) => portfolio.id !== id)
        )
        if (activePortfolio?.id === id) {
          setActivePortfolio(userPortfolios?.[0])
        }
        portfoliosQuery.refetch()
      },
      onError: (error) => {
        console.error('Profile remove failed', error)
      },
    })
  }

  useEffect(() => {
    if (portfoliosQuery.isSuccess && !hasLoaded) {
      setUserPortfolios(portfoliosQuery.data.sort((a, b) => a.id - b.id))
      setActivePortfolio(portfoliosQuery.data[0])
      setHasLoaded(true)
    }
  }, [portfoliosQuery.data, portfoliosQuery.isSuccess, hasLoaded])

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
