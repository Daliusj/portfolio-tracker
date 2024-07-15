import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { CurrencyExchangeRate } from '@server/database/types'

export const currencyExchangeRateSchema = z.object({
  currencyFrom: z.string().length(3),
  currencyTo: z.string().length(3),
  exchangeRate: z.number().positive(),
  lastUpdate: z.date().default(() => new Date()),
})

export const currencyExchangeRateKeysAll = Object.keys(
  currencyExchangeRateSchema.shape
) as (keyof CurrencyExchangeRate)[]

export const currencyExchangeRateKeysPublic = currencyExchangeRateKeysAll
export type CurrencyExchangeRatePublic = Pick<
  Selectable<CurrencyExchangeRate>,
  (typeof currencyExchangeRateKeysPublic)[number]
>

export type CurrencySymbolsCombination = Pick<
  Selectable<CurrencyExchangeRate>,
  'currencyFrom' | 'currencyTo'
>
