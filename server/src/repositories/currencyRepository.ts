import type { Database } from '@server/database'
import {
  currencyKeysPublic,
  type CurrencyPublic,
} from '@server/entities/currency'

export function currencyRepository(db: Database) {
  return {
    async findAll(): Promise<CurrencyPublic[]> {
      return db.selectFrom('currency').select(currencyKeysPublic).execute()
    },
  }
}
