import type { Database, Asset } from '@server/database'
import { type AssetPublic, assetKeysPublic } from '@server/entities/asset'
import type { Insertable } from 'kysely'

export function assetRepository(db: Database) {
  return {
    async create(
      asset: Insertable<Asset> | Insertable<Asset>[]
    ): Promise<number> {
      const result = await db.insertInto('asset').values(asset).execute()
      return result.length
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
      const assetsCount = (await db.selectFrom('asset').selectAll().execute())
        .length
      return !assetsCount
    },
  }
}

export type AssetRepository = ReturnType<typeof assetRepository>
