import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { PortfolioItemPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'

type PortfolioItemContext = {
  activePortfolioItem: PortfolioItemPublic | undefined
  userPortfolioItems: PortfolioItemPublic[] | undefined
  setActivePortfolioItem: React.Dispatch<React.SetStateAction<PortfolioItemPublic | undefined>>
  create: ({
    assetId,
    portfolioId,
    purchaseDate,
    purchasePrice,
    quantity,
  }: PortfolioItemCreate) => void
  update: ({
    id,
    assetId,
    portfolioId,
    purchaseDate,
    purchasePrice,
    quantity,
  }: PortfolioItemUpdate) => void
  remove: (idObj: PortfolioItemRemove) => void
}

type PortfolioItemProviderProps = {
  children: ReactNode
}

type PortfolioItemUpdate = Pick<
  PortfolioItemPublic,
  'assetId' | 'id' | 'portfolioId' | 'purchaseDate' | 'purchasePrice' | 'quantity'
>
type PortfolioItemCreate = Pick<
  PortfolioItemPublic,
  'assetId' | 'portfolioId' | 'purchaseDate' | 'purchasePrice' | 'quantity'
>
type PortfolioItemRemove = Pick<PortfolioItemPublic, 'id'>

const defaultPortfolioItemContext: PortfolioItemContext = {
  userPortfolioItems: undefined,
  activePortfolioItem: undefined,
  setActivePortfolioItem: () => {},
  update: () => {},
  create: () => {},
  remove: () => {},
}

const PortfolioItemContext = createContext<PortfolioItemContext>(defaultPortfolioItemContext)

export const AssetProvider = ({ children }: PortfolioItemProviderProps) => {
  const [activePortfolioItem, setActivePortfolioItem] = useState<PortfolioItemPublic | undefined>(
    undefined
  )
  const [userPortfolioItems, setUserPortfolioItems] = useState<PortfolioItemPublic[] | undefined>(
    undefined
  )
  const [hasLoaded, setHasLoaded] = useState(false)
  const userPortfolios = usePortfolio()

  const portfolioItemQuery =
    userPortfolios.activePortfolio?.id &&
    trpc.portfolioItem.get.useQuery({ portfolioId: userPortfolios.activePortfolio?.id })

  const portfolioItemMutation = {
    create: trpc.portfolioItem.create.useMutation(),
    update: trpc.portfolioItem.update.useMutation(),
    remove: trpc.portfolioItem.remove.useMutation(),
  }

  const update = ({
    id,
    assetId,
    portfolioId,
    purchaseDate,
    purchasePrice,
    quantity,
  }: PortfolioItemUpdate) => {
    portfolioItemMutation.update.mutate(
      {
        id,
        assetId,
        portfolioId,
        purchaseDate: purchaseDate.toISOString().split('T')[0],
        purchasePrice: Number(purchasePrice),
        quantity: Number(quantity),
      },
      {
        onSuccess: (updatedPortfolioItem) => {
          setUserPortfolioItems((prevPortfolioItems) =>
            prevPortfolioItems?.map((portfolioItem) =>
              portfolioItem.id === id
                ? { ...portfolioItem, assetId, portfolioId, purchaseDate, purchasePrice, quantity }
                : portfolioItem
            )
          )
          if (activePortfolioItem?.id === id) {
            setActivePortfolioItem((prev) =>
              prev ? { ...prev, assetId, portfolioId, purchaseDate, purchasePrice, quantity } : prev
            )
          }
          portfolioItemQuery && portfolioItemQuery.refetch()
        },
        onError: (error) => {
          console.error('Portfolio item update', error)
        },
      }
    )
  }

  const create = ({
    assetId,
    portfolioId,
    purchaseDate,
    purchasePrice,
    quantity,
  }: PortfolioItemCreate) => {
    portfolioItemMutation.create.mutate(
      {
        assetId,
        portfolioId,
        purchaseDate: purchaseDate.toISOString().split('T')[0],
        purchasePrice: Number(purchasePrice),
        quantity: Number(quantity),
      },
      {
        onSuccess: (newPortfolioItem) => {
          setUserPortfolioItems((prevPortfolioItems) =>
            prevPortfolioItems ? [...prevPortfolioItems, newPortfolioItem] : [newPortfolioItem]
          )
          setActivePortfolioItem(newPortfolioItem)
          portfolioItemQuery && portfolioItemQuery.refetch()
        },
        onError: (error) => {
          console.error('Portfolio item create failed', error)
        },
      }
    )
  }

  const remove = (idObj: PortfolioItemRemove) => {
    const { id } = idObj
    portfolioItemMutation.remove.mutate(idObj, {
      onSuccess: () => {
        setUserPortfolioItems((prevPortfolioItems) =>
          prevPortfolioItems?.filter((portfolioItem) => portfolioItem.id !== id)
        )
        if (activePortfolioItem?.id === id) {
          setActivePortfolioItem(userPortfolioItems?.[0])
        }
        portfolioItemQuery && portfolioItemQuery.refetch()
      },
      onError: (error) => {
        console.error('Portfolio item remove failed', error)
      },
    })
  }

  useEffect(() => {
    if (portfolioItemQuery && portfolioItemQuery.isSuccess && !hasLoaded) {
      setUserPortfolioItems(portfolioItemQuery.data)
      setHasLoaded(true)
    }
  }, [portfolioItemQuery, hasLoaded])

  if (!hasLoaded) {
    return <div>Loading...</div>
  }

  return (
    <PortfolioItemContext.Provider
      value={{
        userPortfolioItems,
        activePortfolioItem,
        setActivePortfolioItem,
        update,
        create,
        remove,
      }}
    >
      {children}
    </PortfolioItemContext.Provider>
  )
}

export const usePortfolioItem = () => useContext(PortfolioItemContext)
