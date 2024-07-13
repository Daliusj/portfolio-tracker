import type { Fmp } from '../utils/externalApi/fmpApi'
import type { PortfolioRepository } from '../repositories/portfolioRepository'

export default (fmpApi: Fmp, portfolioRepository: PortfolioRepository) => ({
  getFullPortfolioValue: async (portfolioId: number) => {
    const portfolioData =
      await portfolioRepository.findFullPortfolio(portfolioId)

    // TODO add curency conversion
    const exchangeRate = 1 // TODO change to real time data

    const values = portfolioData.map(
      (asset) => Number(asset.price) * Number(asset.quantity) * exchangeRate
    )
    return values.reduce((acc, value) => acc + value)
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
