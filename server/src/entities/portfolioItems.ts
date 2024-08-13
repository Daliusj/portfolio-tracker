import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { PortfolioItem } from '@server/database/types'
import { idSchema } from './shared'

export const reusablePortfolioItemSchemas = {
  quantity: z.number().positive(),
  purchasePrice: z.number().positive(),
  purchaseDate: z.string().date(),
}

export const portfolioItemSchema = z.object({
  id: idSchema,
  portfolioId: idSchema,
  assetId: idSchema,
  quantity: reusablePortfolioItemSchemas.quantity,
  purchasePrice: reusablePortfolioItemSchemas.purchasePrice,
  purchaseDate: reusablePortfolioItemSchemas.purchaseDate,
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
