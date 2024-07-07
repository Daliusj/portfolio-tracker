import type { Database, PortfolioItem } from '@server/database'
import {
  type PortfolioItemPublic,
  portfolioItemKeysPublic,
} from '@server/entities/portfolioItems'
import type { Insertable } from 'kysely'

export function portfolioItemRepository(db: Database) {
  return {
    async create(
      portfolioItem: Insertable<PortfolioItem>
    ): Promise<PortfolioItemPublic> {
      return db
        .insertInto('portfolioItem')
        .values(portfolioItem)
        .returning(portfolioItemKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findById(
      portfolioItemId: number
    ): Promise<PortfolioItemPublic | undefined> {
      return db
        .selectFrom('portfolioItem')
        .select(portfolioItemKeysPublic)
        .where('id', '=', portfolioItemId)
        .executeTakeFirst()
    },

    async findByPortfolioId(
      portfolioId: number
    ): Promise<PortfolioItemPublic[]> {
      return db
        .selectFrom('portfolioItem')
        .select(portfolioItemKeysPublic)
        .where('portfolioId', '=', portfolioId)
        .execute()
    },
  }
}

export type AssetRepository = ReturnType<typeof portfolioItemRepository>
