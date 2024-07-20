import type { Database, InvestmentType } from '@server/database'
import { currencyExchangeRateRepository } from '@server/repositories/currencyExchangeRatesRepository'
import type {
  FullPortfolioPublic,
  PortfolioPublic,
} from '@server/entities/portfolio'
import type { Fmp } from '@server/utils/externalApi/fmpApi'
import { portfolioRepository } from '../repositories/portfolioRepository'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (db: Database, fmpApi: Fmp) => {
  const portfolioRepo = portfolioRepository(db)
  const exchangeRateRepo = currencyExchangeRateRepository(db)

  const calculateValue = async (
    portfolio: PortfolioPublic,
    portfolioAssets: FullPortfolioPublic[]
  ) => {
    const valuePromises = portfolioAssets.map(async (asset) => {
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
    return values.reduce((acc, value) => acc + value).toFixed(2)
  }

  return {
    getTotalValue: async (portfolioId: number) => {
      const portfolio = await portfolioRepo.findById(portfolioId)
      const portfolioAssets = await portfolioRepo.findFull(portfolioId)

      try {
        if (portfolio?.currencySymbol && portfolioAssets.length) {
          const value = await calculateValue(portfolio, portfolioAssets)
          return value
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

    getAssetsTypeValue: async (portfolioId: number, type: InvestmentType) => {
      const portfolio = await portfolioRepo.findById(portfolioId)
      const portfolioAssets = await portfolioRepo.findFullByAssetsType(
        portfolioId,
        type
      )

      try {
        if (portfolio?.currencySymbol && portfolioAssets.length) {
          const value = await calculateValue(portfolio, portfolioAssets)
          return value
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

    getAssetValue: async (portfolioId: number, assetId: number) => {
      const portfolio = await portfolioRepo.findById(portfolioId)
      const portfolioAsset = await portfolioRepo.findFullByAssetId(
        portfolioId,
        assetId
      )
      try {
        if (portfolio?.currencySymbol && portfolioAsset.length) {
          const value = await calculateValue(portfolio, portfolioAsset)
          return value
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
  }
}
