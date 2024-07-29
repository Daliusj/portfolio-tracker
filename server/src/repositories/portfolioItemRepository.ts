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
        .values({
          ...portfolioItem,
          purchaseDate: new Date(`${portfolioItem.purchaseDate} 12:00:00`),
        })
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

    async update(
      portfolioItem: Insertable<PortfolioItem>,
      portfolioItemId: number
    ): Promise<PortfolioItemPublic> {
      await db
        .updateTable('portfolioItem')
        .set({
          purchaseDate: new Date(`${portfolioItem.purchaseDate} 12:00:00`),
          purchasePrice: portfolioItem.purchasePrice,
          quantity: portfolioItem.quantity,
        })
        .where('id', '=', portfolioItemId)
        .executeTakeFirst()

      return db
        .selectFrom('portfolioItem')
        .selectAll()
        .where('id', '=', portfolioItemId)
        .executeTakeFirstOrThrow()
    },

    async remove(
      portfolioItemId: number
    ): Promise<PortfolioItemPublic | undefined> {
      const deletedPortfolioItem = await db
        .selectFrom('portfolioItem')
        .selectAll()
        .where('id', '=', portfolioItemId)
        .executeTakeFirst()

      await db
        .deleteFrom('portfolioItem')
        .where('id', '=', portfolioItemId)
        .executeTakeFirst()

      return deletedPortfolioItem
    },
  }
}

export type PortfolioItemsRepository = ReturnType<
  typeof portfolioItemRepository
>
