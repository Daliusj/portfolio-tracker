import type { Database, Asset } from '@server/database'
import { type AssetPublic, assetKeysPublic } from '@server/entities/asset'
import type { Insertable } from 'kysely'

export function assetRepository(db: Database) {
  return {
    async create(asset: Insertable<Asset>): Promise<AssetPublic> {
      return db
        .insertInto('asset')
        .values(asset)
        .returning(assetKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findById(assetId: number): Promise<AssetPublic | undefined> {
      return db
        .selectFrom('asset')
        .select(assetKeysPublic)
        .where('id', '=', assetId)
        .executeTakeFirst()
    },

    async findAll(): Promise<AssetPublic[]> {
      return db.selectFrom('asset').select(assetKeysPublic).execute()
    },
  }
}

export type AssetRepository = ReturnType<typeof assetRepository>
