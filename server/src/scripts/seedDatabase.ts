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

        const assets = await repository.create([
          ...stocks,
          ...cryptos,
          ...funds,
        ])
        return assets
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

// TODO add update timestamp to database
