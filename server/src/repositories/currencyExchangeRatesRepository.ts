import type { Database, CurrencyExchangeRate } from '@server/database'
import {
  currencyExchangeRateKeysPublic,
  type CurrencyExchangeRatePublic,
  type CurrencySymbolsCombination,
} from '@server/entities/currencyExchangeRates'
import type { Insertable } from 'kysely'

export function currencyExchangeRateRepository(db: Database) {
  return {
    async create(
      currencyExchangeRate:
        | Insertable<CurrencyExchangeRate>
        | Insertable<CurrencyExchangeRate>[]
    ): Promise<CurrencyExchangeRatePublic[]> {
      const result = await db
        .insertInto('currencyExchangeRate')
        .values(currencyExchangeRate)
        .returningAll()
        .execute()
      return result
    },

    async findRate(
      symbolCombination: Insertable<CurrencySymbolsCombination>
    ): Promise<CurrencyExchangeRatePublic | undefined> {
      const result = await db
        .selectFrom('currencyExchangeRate')
        .select(currencyExchangeRateKeysPublic)
        .where(({ eb, and }) =>
          and([
            eb('currencyFrom', '=', symbolCombination.currencyFrom),
            eb('currencyTo', '=', symbolCombination.currencyTo),
          ])
        )
        .executeTakeFirst()
      return result
    },
  }
}
