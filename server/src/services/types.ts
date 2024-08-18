export type AssetStatsPublic = {
  assetId: number
  name: string
  totalQuantity: string
  avgBuyPrice: string
  allocation: string
  price: string
  value: string
  valueInBaseCurrencie: string
  valueChange: string
  percentageChange: string
  assetCurrencyCode: string
}

export type PortfolioStatsPublic = {
  portfolioId: number
  totalPortfolioValue: number
  valueChange: string
  percentageChange: string
}
