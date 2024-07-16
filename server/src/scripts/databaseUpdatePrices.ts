// TODO update assetes prices every day 00:00 UTC

import type { Database } from '@server/database'
import { assetRepository as buildAssetRepository } from '../repositories/assetRepository'

import type { Fmp } from '../utils/externalApi/fmpApi'

export function databaseUpdatePrices(db: Database, fmpApi: Fmp) {
  const assetRepo = buildAssetRepository(db)

  return {
    update: async () => {
      try {
        const stockPrices = await fmpApi.fetchAllStocksPrices()
        const fundPrices = await fmpApi.fetchAllFundsPrices()
        const cryptoPrices = await fmpApi.fetchAllCryptosPrices()
        const updatedAssets = await assetRepo.updatePrices([
          ...stockPrices,
          ...fundPrices,
          ...cryptoPrices,
        ])
        return updatedAssets
      } catch (err) {
        throw new Error(
          `Error updating assets prices: ${
            err instanceof Error ? err.message : 'An unknown error occurred'
          }`
        )
      }
    },
  }
}

export type DatabaseUpdatePrices = ReturnType<typeof databaseUpdatePrices>
