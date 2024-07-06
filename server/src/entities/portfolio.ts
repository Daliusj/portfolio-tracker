import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Portfolio } from '@server/database/types'
import { idSchema } from './shared'

export const portfolioSchema = z.object({
  id: idSchema,
  userId: idSchema,
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
