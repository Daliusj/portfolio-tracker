import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { PortfolioItemPublic } from '@server/shared/types'
import { trpc } from '@/trpc'
import { usePortfolio } from './PortfolioContext'
import { localDateToIsoString } from '@/utils/time'

type PortfolioItemContext = {
  activePortfolioItem: PortfolioItemAdjusted | undefined
  userPortfolioItems: PortfolioItemAdjusted[] | undefined
  setActivePortfolioItem: React.Dispatch<React.SetStateAction<PortfolioItemAdjusted | undefined>>
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

type PortfolioItemAdjusted = Omit<PortfolioItemPublic, 'purchasePrice' | 'quantity'> & {
  purchasePrice: number
  quantity: number
}

type PortfolioItemUpdate = Pick<
  PortfolioItemAdjusted,
  'assetId' | 'id' | 'portfolioId' | 'purchaseDate' | 'purchasePrice' | 'quantity'
>
type PortfolioItemCreate = Pick<
  PortfolioItemAdjusted,
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

export const PortfolioItemProvider = ({ children }: PortfolioItemProviderProps) => {
  const [activePortfolioItem, setActivePortfolioItem] = useState<PortfolioItemAdjusted | undefined>(
    undefined
  )
  const [userPortfolioItems, setUserPortfolioItems] = useState<PortfolioItemAdjusted[] | undefined>(
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
        purchaseDate: localDateToIsoString(purchaseDate),
        purchasePrice,
        quantity,
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
        purchaseDate: localDateToIsoString(purchaseDate),
        purchasePrice,
        quantity,
      },
      {
        onSuccess: (newPortfolioItem) => {
          const adjustedItem: PortfolioItemAdjusted = {
            ...newPortfolioItem,
            purchasePrice,
            quantity,
          }

          setUserPortfolioItems((prevPortfolioItems) =>
            prevPortfolioItems ? [...prevPortfolioItems, adjustedItem] : [adjustedItem]
          )
          setActivePortfolioItem(adjustedItem)
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
      const adjustedItems: PortfolioItemAdjusted[] = portfolioItemQuery.data.map((item) => ({
        ...item,
        purchasePrice: Number(item.purchasePrice),
        quantity: Number(item.quantity),
      }))

      setUserPortfolioItems(adjustedItems)
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
