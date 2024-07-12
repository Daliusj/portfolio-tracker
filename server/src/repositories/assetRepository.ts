import type { Database, Asset } from '@server/database'
import {
  type AssetPrice,
  type AssetPublic,
  assetKeysPublic,
} from '@server/entities/asset'
import type { Insertable } from 'kysely'
import { sql } from 'kysely'

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

    async findById(assetId: number): Promise<AssetPublic | undefined> {
      return db
        .selectFrom('asset')
        .select(assetKeysPublic)
        .where('id', '=', assetId)
        .executeTakeFirst()
    },

    async findAsset(query: string): Promise<AssetPublic[]> {
      const partialQuery = `%${query}%`
      return db
        .selectFrom('asset')
        .select(assetKeysPublic)
        .where((eb) =>
          eb.or([
            eb('name', 'ilike', partialQuery),
            eb('symbol', 'ilike', partialQuery),
          ])
        )
        .execute()
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
