import { z } from 'zod'
import type { Selectable, Insertable } from 'kysely'
import type { Asset } from '@server/database/types'
import { idSchema } from './shared'

export const INVESTMENT_TYPES = ['crypto', 'fund', 'stock'] as const
const POSTGRES_INT_MAX = 2147483647

export const reusableAssetsSchemas = {
  name: z.string().min(1).max(50),
  price: z.number().positive(),
  type: z.enum(INVESTMENT_TYPES),
}

export const assetSchema = z.object({
  id: idSchema,
  name: reusableAssetsSchemas.name,
  type: reusableAssetsSchemas.type,
  symbol: z.string().min(1).max(10),
  price: reusableAssetsSchemas.price,
  exchange: z.string().min(1).max(500),
  exchangeShortName: z.string().min(1).max(500),
  createdAt: z.date().default(() => new Date()),
})

export const assetIdArrSchema = z.object({
  id: z.array(idSchema),
})

export const assetQuerySchema = z.object({
  query: z.string().min(1).max(50),
  offset: z.number().int().min(0).max(POSTGRES_INT_MAX).default(0),
  limit: z.number().int().min(1).max(100).default(20),
})

export const assetKeysAll = Object.keys(assetSchema.shape) as (keyof Asset)[]

export const assetKeysPublic = assetKeysAll
export type AssetPublic = Pick<
  Selectable<Asset>,
  (typeof assetKeysPublic)[number]
>

export type AssetPrice = Pick<Insertable<Asset>, 'price' | 'symbol'>
