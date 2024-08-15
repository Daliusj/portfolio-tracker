import type { Database } from '@server/database'
import {
  exchangeKeysPublic,
  type ExchangePublic,
} from '@server/entities/exchange'

export function exchangeRepository(db: Database) {
  return {
    async findByShortName(
      shortName: string
    ): Promise<ExchangePublic | undefined> {
      return db
        .selectFrom('exchange')
        .select(exchangeKeysPublic)
        .where('exchange.shortName', '=', shortName)
        .executeTakeFirst()
    },
  }
}