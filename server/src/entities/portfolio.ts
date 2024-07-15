import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Asset, Portfolio, PortfolioItem } from '@server/database/types'
import { idSchema } from './shared'
import { assetFieldsForFullPortfolio } from './asset'
import { portfolioItemFieldsForFullPortfolio } from './portfolioItems'

export const portfolioSchema = z.object({
  id: idSchema,
  userId: idSchema,
  currencySymbol: z.string().length(3),
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

const combinedSchema = assetFieldsForFullPortfolio.merge(
  portfolioItemFieldsForFullPortfolio
)

export const fullPortfolioSchema = combinedSchema.extend({
  currencyCode: z.string().length(3),
})

type FullPortfolio = {
  id: Asset['id']
  name: Asset['name']
  price: Asset['price']
  type: Asset['type']
  quantity: PortfolioItem['quantity']
  currencyCode: string
}

export const fullPortfolioKeysAll = Object.keys(
  fullPortfolioSchema.shape
) as (keyof FullPortfolio)[]

export const fullPortfolioKeysPublic = fullPortfolioKeysAll

export type FullPortfolioPublic = Pick<
  Selectable<FullPortfolio>,
  (typeof fullPortfolioKeysPublic)[number]
>
