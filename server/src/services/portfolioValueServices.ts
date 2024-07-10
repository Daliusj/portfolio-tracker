import type { Fmp } from './externalApi/fmpApi'

export default async (fmpApi: Fmp) => ({
  getFullPortfolioValue: (portfolioId) => {},
  getValueByAssetsType: (portfolioId, type) => {},
  getAssetvalue: (portfolioId, PortfolioItemId) => {},
})
