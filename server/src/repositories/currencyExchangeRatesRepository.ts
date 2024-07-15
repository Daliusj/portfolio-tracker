import type { Database, CurrencyExchangeRate } from '@server/database'
import {
  currencyExchangeRateKeysPublic,
  type CurrencyExchangeRatePublic,
  type CurrencySymbolsCombination,
} from '@server/entities/currencyExchangeRates'
import type { Insertable } from 'kysely'

export function currencyExchangeRateRepository(db: Database) {
  return {
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

    async upsert(
      exchangeRates: Insertable<CurrencyExchangeRate>[]
    ): Promise<CurrencyExchangeRatePublic[]> {
      const results: CurrencyExchangeRatePublic[] = []

      const promises = exchangeRates.map(async (exchangeRate) => {
        const result = await db
          .insertInto('currencyExchangeRate')
          .values(exchangeRate)
          .onConflict((oc) =>
            oc.columns(['currencyFrom', 'currencyTo']).doUpdateSet((eb) => ({
              exchangeRate: eb.ref('excluded.exchangeRate'),
            }))
          )
          .returningAll()
          .execute()

        return result[0]
      })
      const resolvedResults = await Promise.all(promises)
      results.push(...resolvedResults)
      return results
    },
  }
}
