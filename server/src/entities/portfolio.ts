import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Asset, Portfolio, PortfolioItem } from '@server/database/types'
import { idSchema } from './shared'
import { reusableAssetsSchemas } from './asset'
import { reusablePortfolioItemSchemas } from './portfolioItems'
import { reusableCurrencySchemas } from './currency'

export const BASE_CURRENCIES = ['USD', 'EUR'] as const

export type BaseCurrency = (typeof BASE_CURRENCIES)[number]

export const portfolioSchema = z.object({
  id: idSchema,
  userId: idSchema,
  name: z.string().min(1).max(30),
  currencySymbol: z.enum(BASE_CURRENCIES),
  createdAt: z.date().default(() => new Date()),
})

export const portfolioKeysAll = Object.keys(
  portfolioSchema.shape
) as (keyof Portfolio)[]

export const portfolioKeysPublic = portfolioKeysAll

export type PortfolioPublic = Pick<
  Selectable<Portfolio>,
  (typeof portfolioKeysPublic)[number]
>

export const fullPortfolioSchema = z.object({
  assetId: idSchema,
  assetName: reusableAssetsSchemas.name,
  assetPrice: reusableAssetsSchemas.price,
  assetType: reusableAssetsSchemas.type,
  quantity: reusablePortfolioItemSchemas.quantity,
  currencyCode: reusableCurrencySchemas.code,
  portfolioItemId: idSchema,
  purchasePrice: reusablePortfolioItemSchemas.purchasePrice,
  purchaseDate: reusablePortfolioItemSchemas.purchaseDate,
})

type FullPortfolio = {
  assetId: number
  assetName: Asset['name']
  assetPrice: Asset['price']
  assetType: Asset['type']
  quantity: PortfolioItem['quantity']
  currencyCode: string
  portfolioItemId: number
  purchasePrice: PortfolioItem['purchasePrice']
  purchaseDate: PortfolioItem['purchaseDate']
}

export const fullPortfolioKeysAll = Object.keys(
  fullPortfolioSchema.shape
) as (keyof FullPortfolio)[]

export const fullPortfolioKeysPublic = fullPortfolioKeysAll

export type FullPortfolioPublic = Pick<
  Selectable<FullPortfolio>,
  (typeof fullPortfolioKeysPublic)[number]
>

export const fullPortfolioGroupedSchema = z.object({
  assetId: idSchema,
  assetName: reusableAssetsSchemas.name,
  assetPrice: reusableAssetsSchemas.price,
  assetType: reusableAssetsSchemas.type,
  purchase: z.array(
    z.object({
      quantity: reusablePortfolioItemSchemas.quantity,
      currencyCode: reusableCurrencySchemas.code,
      portfolioItemId: idSchema,
      purchasePrice: reusablePortfolioItemSchemas.purchasePrice,
      purchaseDate: reusablePortfolioItemSchemas.purchaseDate,
    })
  ),
})

export type Purchase = {
  portfolioItemId: FullPortfolio['portfolioItemId']
  quantity: FullPortfolio['quantity']
  purchasePrice: FullPortfolio['purchasePrice']
  purchaseDate: FullPortfolio['purchaseDate']
}

export type FullPortfolioGrouped = {
  assetId: FullPortfolio['assetId']
  assetName: FullPortfolio['assetName']
  assetPrice: FullPortfolio['assetPrice']
  assetType: FullPortfolio['assetType']
  currencyCode: FullPortfolio['currencyCode']
  purchases: Selectable<Purchase>[]
}

export const fullPortfolioGroupedKeysAll = Object.keys(
  fullPortfolioGroupedSchema.shape
) as (keyof FullPortfolioGrouped)[]

export const fullPortfolioGroupedKeysPublic = fullPortfolioGroupedKeysAll

export type FullPortfolioGroupedPublic = Pick<
  Selectable<FullPortfolioGrouped>,
  (typeof fullPortfolioGroupedKeysPublic)[number]
>
