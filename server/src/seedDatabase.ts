import buildFmp from './utils/externalApi/fmpApi'
import { assetRepository } from './repositories/assetRepository'
import type { Database } from './database'

export default async (db: Database) => {
  const fmpApi = buildFmp()
  const repository = assetRepository(db)
  try {
    if (!repository.isAssetsEmpty()) {
      const stocks = await fmpApi.fetchAllStocks()
      const cryptos = await fmpApi.fetchAllCryptos()
      const funds = await fmpApi.fetchAllFunds()

      await repository.create(stocks)
      await repository.create(cryptos)
      await repository.create(funds)
    }
  } catch (err) {
    throw new Error(
      `Error seeding the database: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}

// TODO add update timestamp to database
