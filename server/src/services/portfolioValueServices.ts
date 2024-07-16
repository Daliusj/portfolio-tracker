import type { Database } from '@server/database'
import { currencyExchangeRateRepository } from '@server/repositories/currencyExchangeRatesRepository'
import { portfolioRepository } from '../repositories/portfolioRepository'

export default (db: Database) => ({
  getFullPortfolioValue: async (portfolioId: number) => {
    const portfolioRepo = portfolioRepository(db)
    const exchangeRateRepo = currencyExchangeRateRepository(db)
    const portfolio = await portfolioRepo.findById(portfolioId)
    const porfolioAssets = await portfolioRepo.findFullPortfolio(portfolioId)

    try {
      if (portfolio?.currencySymbol && porfolioAssets.length) {
        const valuePromises = porfolioAssets.map(async (asset) => {
          const exchangeData = await exchangeRateRepo.findRate({
            currencyFrom: portfolio.currencySymbol.toUpperCase(),
            currencyTo: asset.currencyCode,
          })
          const value =
            Number(asset.price) *
            Number(asset.quantity) *
            Number(exchangeData?.exchangeRate)
          return value
        })
        const values = await Promise.all(valuePromises)
        return values.reduce((acc, value) => acc + value)
      }
      throw new Error(
        `No assets found for portfolioId ${portfolioId} or currency symbol is missing.`
      )
    } catch (err) {
      throw new Error(
        `Error calculating portfolio value: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  },

  getValueByAssetsType: async (portfolioId, type) => {
    // getPortfolioItems
    // getAssetsByType
    // getValue
    // convertValueToUserCurrency
    // return value in user's prefered currency
  },

  getAssetvalue: async (userId, PortfolioItemId) => {
    // getAsset
    // getValue
    // convertValueToUserCurrency
    // return value in user's prefered currency
  },
})
