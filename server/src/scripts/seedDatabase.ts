/* eslint-disable no-console */
import { chunk } from 'lodash-es'
import type { Fmp } from '../utils/externalApi/fmpApi'
import { assetRepository } from '../repositories/assetRepository'
import type { Database } from '../database'

export function seedDatabase(db: Database, fmpApi: Fmp) {
  const repository = assetRepository(db)

  const seed = async () => {
    try {
      if (await repository.isAssetsEmpty()) {
        const stocks = await fmpApi.fetchAllStocks()
        const cryptos = await fmpApi.fetchAllCryptos()
        const funds = await fmpApi.fetchAllFunds()

        const filterEmptyData = (assets: any[]) =>
          assets.filter(
            (asset) =>
              asset.name &&
              asset.name.trim() !== '' &&
              asset.exchange &&
              asset.exchange.trim() !== '' &&
              asset.price
          )

        const filteredAssets = filterEmptyData([
          ...new Set([...stocks, ...cryptos, ...funds]),
        ])

        const assetsChuncked = chunk(filteredAssets, 100)

        const createChunks = async (chunks: any[]) => {
          await Promise.all(
            chunks.map(async (chunkData, index) => {
              try {
                console.log(`Processing chunk ${index + 1} of ${chunks.length}`)
                await repository.create(chunkData)
                console.log(`Chunk ${index + 1} successfully processed`)
              } catch (error) {
                console.error(`Error processing chunk ${index + 1}:`, error)
                throw error
              }
            })
          )
        }

        await Promise.all([createChunks(assetsChuncked)])
      }
    } catch (err) {
      throw new Error(
        `Error seeding the database: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
    return undefined
  }
  return { seed }
}

export type SeedDatabase = ReturnType<typeof seedDatabase>
