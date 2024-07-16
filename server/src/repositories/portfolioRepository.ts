import type { Database, Portfolio } from '@server/database'
import {
  type FullPortfolioPublic,
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

    async findById(id: number): Promise<PortfolioPublic | undefined> {
      return db
        .selectFrom('portfolio')
        .select(portfolioKeysPublic)
        .where('id', '=', id)
        .executeTakeFirst()
    },

    async findFullPortfolio(
      portfolioId: number
    ): Promise<FullPortfolioPublic[]> {
      return db
        .selectFrom('asset')
        .innerJoin('portfolioItem', 'portfolioItem.assetId', 'asset.id')
        .innerJoin('portfolio', 'portfolio.id', 'portfolioItem.portfolioId')
        .innerJoin('exchange', 'exchange.shortName', 'asset.exchangeShortName')
        .innerJoin('currency', 'currency.code', 'exchange.currencyCode')
        .select([
          'asset.id',
          'asset.name',
          'asset.price',
          'asset.type',
          'portfolioItem.quantity',
          'currency.code as currencyCode',
        ])
        .where('portfolio.id', '=', portfolioId)
        .execute()
    },
  }
}

export type PortfolioRepository = ReturnType<typeof portfolioRepository>
