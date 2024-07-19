import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Currency } from '@server/database/types'
import { idSchema } from './shared'

export const currencySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(100),
  code: z.string().length(3),
  isBase: z.boolean(),
})

export const currencyKeysAll = Object.keys(
  currencySchema.shape
) as (keyof Currency)[]

export const currencyKeysPublic = currencyKeysAll
export type CurrencyPublic = Pick<
  Selectable<Currency>,
  (typeof currencyKeysPublic)[number]
>
