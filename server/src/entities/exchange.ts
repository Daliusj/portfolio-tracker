import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { Exchange } from '@server/database/types'
import { reusableCurrencySchemas } from './currency'
import { idSchema } from './shared'

export const exchangeSchema = z.object({
  id: idSchema,
  shortName: z.string().min(1).max(20),
  currencyCode: reusableCurrencySchemas.code,
  name: z.string().min(1).max(100),
})

export const exchangeKeysAll = Object.keys(
  exchangeSchema.shape
) as (keyof Exchange)[]

export const exchangeKeysPublic = exchangeKeysAll
export type ExchangePublic = Pick<
  Selectable<Exchange>,
  (typeof exchangeKeysPublic)[number]
>
