import type { Fmp } from './services/externalApi/fmpApi'
import type { AssetRepository } from './repositories/assetRepository'

export default async (fmpApi: Fmp, assetsRepository: AssetRepository) => {
  try {
    const stocks = await fmpApi.fetchAllStocks()
    const cryptos = await fmpApi.fetchAllCryptos()
    const funds = await fmpApi.fetchAllFunds()

    await assetsRepository.saveStocks(stocks)
    await assetsRepository.saveCryptos(cryptos)
    await assetsRepository.saveFunds(funds)
  } catch (err) {
    throw new Error(
      `Error seeding the database: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}
