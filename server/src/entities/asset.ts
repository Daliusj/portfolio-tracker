import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Asset } from '@server/database/types'
import { idSchema } from './shared'

const INVESTMENT_TYPES = ['crypto', 'fund', 'stock'] as const

export const assetSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(500),
  type: z.enum(INVESTMENT_TYPES),
  symbol: z.string().min(1).max(500),
  createdAt: z.date().default(() => new Date()),
})

export const assetKeysAll = Object.keys(assetSchema.shape) as (keyof Asset)[]
export const assetKeysPublic = assetKeysAll
export type AssetPublic = Pick<
  Selectable<Asset>,
  (typeof assetKeysPublic)[number]
>
