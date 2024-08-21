/* eslint-disable no-console */
import type { Database } from '@server/database'
import { uniqBy, chunk } from 'lodash-es'
import { assetRepository as buildAssetRepository } from '../../repositories/assetRepository'
import type { Fmp } from '../../utils/externalApi/fmpApi'

export function databaseUpdatePrices(db: Database, fmpApi: Fmp) {
  const assetRepo = buildAssetRepository(db)

  return {
    update: async () => {
      try {
        const stockPrices = await fmpApi.fetchAllStocksPrices()
        const fundPrices = await fmpApi.fetchAllFundsPrices()
        const cryptoPrices = await fmpApi.fetchAllCryptosPrices()

        const joinedAssets = uniqBy(
          [...stockPrices, ...cryptoPrices, ...fundPrices],
          'symbol'
        )

        const assetsChunked = chunk(joinedAssets, 100)

        const createChunks = async (chunks: any[]) => {
          await Promise.all(
            chunks.map(async (chunkData, index) => {
              try {
                await assetRepo.updatePrices(chunkData)
              } catch (error) {
                console.error(`Error processing chunk ${index + 1}:`, error)
                throw error
              }
            })
          )
        }

        await Promise.all([createChunks(assetsChunked)])
        return { success: true }
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
