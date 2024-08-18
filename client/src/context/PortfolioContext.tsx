import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { BaseCurrency, PortfolioPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { useMessage } from './MessageContext'

type PortfolioContext = {
  userPortfolios: PortfolioPublic[] | []
  activePortfolio: PortfolioPublic | undefined
  setActivePortfolio: React.Dispatch<React.SetStateAction<PortfolioPublic | undefined>>
  update: ({ id, name, currencySymbol }: PortfolioUpdate) => void
  create: ({ name, currencySymbol }: PortfolioCreate) => void
  remove: (id: PortfolioRemove) => void
  hasLoaded: boolean
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
  userPortfolios: [],
  activePortfolio: undefined,
  setActivePortfolio: () => {},
  update: () => {},
  create: () => {},
  remove: () => {},
  hasLoaded: false,
}

const PortfolioContext = createContext<PortfolioContext>(defaultPortfolioContext)

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [activePortfolio, setActivePortfolio] = useState<PortfolioPublic | undefined>(undefined)
  const [userPortfolios, setUserPortfolios] = useState<PortfolioPublic[] | []>([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const { setMessage } = useMessage()

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
        onSuccess: () => {
          setUserPortfolios((prevPortfolios) =>
            prevPortfolios?.map((portfolio) =>
              portfolio.id === id ? { ...portfolio, name, currencySymbol } : portfolio
            )
          )
          if (activePortfolio?.id === id) {
            setActivePortfolio((prev) => (prev ? { ...prev, name, currencySymbol } : prev))
          }
          portfoliosQuery.refetch()
          setMessage('success', ['Portfolio updated successfully'])
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
          portfoliosQuery.refetch()
          setUserPortfolios((prevPortfolios) =>
            prevPortfolios ? [...prevPortfolios, newPortfolio] : [newPortfolio]
          )
          setActivePortfolio(newPortfolio)
          setMessage('success', ['Portfolio created successfully'])
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
        setMessage('success', ['Portfolio removed successfully'])
      },
    })
  }

  useEffect(() => {
    if (portfoliosQuery.isSuccess && !hasLoaded) {
      const sortedPortfolios = portfoliosQuery.data.sort((a, b) => a.id - b.id)
      setUserPortfolios(sortedPortfolios)
      setActivePortfolio(sortedPortfolios[0])
      setHasLoaded(true)
    }
  }, [portfoliosQuery.data, portfoliosQuery.isSuccess, hasLoaded])

  if (!hasLoaded) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioContext.Provider
      value={{
        userPortfolios,
        activePortfolio,
        setActivePortfolio,
        update,
        create,
        remove,
        hasLoaded,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => useContext(PortfolioContext)
