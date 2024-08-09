import type { Database, Asset } from '@server/database'
import {
  type AssetPrice,
  type AssetPublic,
  assetKeysPublic,
} from '@server/entities/asset'
import type { Insertable } from 'kysely'
import { sql } from 'kysely'

type Pagination = {
  offset: number
  limit: number
}

export function assetRepository(db: Database) {
  return {
    async create(
      asset: Insertable<Asset> | Insertable<Asset>[]
    ): Promise<AssetPublic[]> {
      const result = await db
        .insertInto('asset')
        .values(asset)
        .returningAll()
        .execute()
      return result
    },

    async findById(assetId: number | number[]): Promise<AssetPublic[]> {
      if (Array.isArray(assetId)) {
        return db
          .selectFrom('asset')
          .select(assetKeysPublic)
          .where('id', 'in', assetId)
          .execute()
      }
      return db
        .selectFrom('asset')
        .select(assetKeysPublic)
        .where('id', '=', assetId)
        .execute()
    },

    async findAsset(
      query: string,
      { offset, limit }: Pagination
    ): Promise<{ data: AssetPublic[]; total: number }> {
      const partialQuery = `%${query}%`

      const numberOfResults = await db
        .selectFrom('asset')
        .select(sql<number>`count(*)`.as('total'))
        .where((eb) =>
          eb.or([
            eb('name', 'ilike', partialQuery),
            eb('symbol', 'ilike', partialQuery),
            eb('exchange', 'ilike', partialQuery),
            eb('exchangeShortName', 'ilike', partialQuery),
          ])
        )
        .executeTakeFirstOrThrow()

      const data = await db
        .selectFrom('asset')
        .select(assetKeysPublic)
        .where((eb) =>
          eb.or([
            eb('name', 'ilike', partialQuery),
            eb('symbol', 'ilike', partialQuery),
            eb('exchange', 'ilike', partialQuery),
            eb('exchangeShortName', 'ilike', partialQuery),
          ])
        )
        .offset(offset)
        .limit(limit)
        .execute()

      return { data, total: numberOfResults.total }
    },

    async findAll(): Promise<AssetPublic[]> {
      return db.selectFrom('asset').select(assetKeysPublic).execute()
    },

    async isAssetsEmpty(): Promise<Boolean> {
      const assetsCount = await db.selectFrom('asset').executeTakeFirst()
      return !assetsCount
    },

    async updatePrices(assetPrices: AssetPrice[]): Promise<AssetPublic[]> {
      const cases = assetPrices.map(
        (assetPrice) => sql`WHEN ${assetPrice.symbol} THEN ${assetPrice.price}`
      )
      const caseStatement = sql.join(cases, sql` `)
      const symbols = assetPrices.map((assetPrice) => assetPrice.symbol)
      const query = db
        .updateTable('asset')
        .set({
          price: sql`CASE symbol ${caseStatement} ELSE price END`,
        })
        .where(sql`symbol`, 'in', symbols)
        .returning(assetKeysPublic)

      const updatedAssets = await query.execute()
      return updatedAssets
    },
  }
}
export type AssetRepository = ReturnType<typeof assetRepository>
