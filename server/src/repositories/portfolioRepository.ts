import type { Database, Portfolio } from '@server/database'
import {
  type PortfolioPublic,
  portfolioKeysPublic,
} from '@server/entities/portfolio'
import type { Insertable } from 'kysely'

export function portfolioRepository(db: Database) {
  return {
    async create(portfolio: Insertable<Portfolio>): Promise<PortfolioPublic> {
      return db
        .insertInto('portfolio')
        .values(portfolio)
        .returning(portfolioKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findByUserId(userId: number): Promise<PortfolioPublic[]> {
      return db
        .selectFrom('portfolio')
        .select(portfolioKeysPublic)
        .where('userId', '=', userId)
        .execute()
    },
  }
}

export type AssetRepository = ReturnType<typeof portfolioRepository>
