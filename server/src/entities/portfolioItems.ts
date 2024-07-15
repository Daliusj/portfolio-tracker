import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { PortfolioItem } from '@server/database/types'
import { idSchema } from './shared'

export const portfolioItemSchema = z.object({
  id: idSchema,

  portfolioId: idSchema,
  assetId: idSchema,
  quantity: z.number().positive(),
  purchasePrice: z.number().positive(),
  purchaseDate: z.date().default(() => new Date()),
  createdAt: z.date().default(() => new Date()),
})

export const portfolioItemKeysAll = Object.keys(
  portfolioItemSchema.shape
) as (keyof PortfolioItem)[]

export const portfolioItemKeysPublic = portfolioItemKeysAll

export type PortfolioItemPublic = Pick<
  Selectable<PortfolioItem>,
  (typeof portfolioItemKeysPublic)[number]
>

export const portfolioItemFieldsForFullPortfolio = portfolioItemSchema.pick({
  quantity: true,
})
