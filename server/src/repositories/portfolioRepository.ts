import type { Database, InvestmentType, Portfolio } from '@server/database'
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

    async update(
      portfolioId: number,
      userId: number,
      currencySymbol: string
    ): Promise<PortfolioPublic> {
      await db
        .updateTable('portfolio')
        .set({ currencySymbol })
        .where(({ and, eb }) =>
          and([eb('id', '=', portfolioId), eb('userId', '=', userId)])
        )
        .executeTakeFirst()

      return db
        .selectFrom('portfolio')
        .selectAll()
        .where(({ and, eb }) =>
          and([eb('id', '=', portfolioId), eb('userId', '=', userId)])
        )
        .executeTakeFirstOrThrow()
    },

    async remove(
      portfolioId: number,
      userId: number
    ): Promise<PortfolioPublic> {
      const deletedPortfolio = await db
        .selectFrom('portfolio')
        .selectAll()
        .where(({ and, eb }) =>
          and([eb('id', '=', portfolioId), eb('userId', '=', userId)])
        )
        .executeTakeFirstOrThrow()

      await db
        .deleteFrom('portfolio')
        .where(({ and, eb }) =>
          and([eb('id', '=', portfolioId), eb('userId', '=', userId)])
        )
        .executeTakeFirst()

      return deletedPortfolio
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

    async findFull(portfolioId: number): Promise<FullPortfolioPublic[]> {
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

    async findFullByAssetsType(
      portfolioId: number,
      assetType: InvestmentType
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
        .where(({ and, eb }) =>
          and([
            eb('portfolio.id', '=', portfolioId),
            eb('asset.type', '=', assetType),
          ])
        )
        .execute()
    },

    async findFullByAssetId(
      portfolioId: number,
      assetId: number
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
        .where(({ and, eb }) =>
          and([
            eb('portfolio.id', '=', portfolioId),
            eb('asset.id', '=', assetId),
          ])
        )
        .execute()
    },
  }
}

export type PortfolioRepository = ReturnType<typeof portfolioRepository>
