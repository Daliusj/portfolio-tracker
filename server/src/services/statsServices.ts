import type { Database } from '@server/database'
import { groupAssets } from '@server/utils/assets'
import { currencyExchangeRateRepository } from '@server/repositories/currencyExchangeRatesRepository'
import { portfolioRepository } from '../repositories/portfolioRepository'
import portfolioValueServices from './portfolioValueServices'
import type { AssetStatsPublic, PortfolioStatsPublic } from './types'

export default (db: Database) => {
  const portfolioRepo = portfolioRepository(db)
  const valueServices = portfolioValueServices(db, {} as any)
  const exchangeRateRepo = currencyExchangeRateRepository(db)

  return {
    getAssetsStats: async (
      portfolioId: number
    ): Promise<AssetStatsPublic[]> => {
      const portfolioAssets = await portfolioRepo.findFull(portfolioId)
      if (portfolioAssets) {
        const groupedAssets = groupAssets(portfolioAssets)
        const totalPortfolioValue =
          await valueServices.getTotalValue(portfolioId)

        return Promise.all(
          groupedAssets.map(async (asset) => {
            const totalQuantity = asset.purchases.reduce(
              (acc, purchase) => acc + Number(purchase.quantity),
              0
            )
            const valueInBaseCurrencie = await valueServices.getAssetValue(
              portfolioId,
              asset.assetId
            )
            const totalPurchaseValue = asset.purchases.reduce(
              (acc, purchase) => acc + Number(purchase.purchasePrice),
              0
            )
            const value = Number(asset.assetPrice) * totalQuantity

            const valueChange = value - totalPurchaseValue

            return {
              assetId: asset.assetId,
              name: asset.assetName,
              totalQuantity: totalQuantity.toFixed(3),
              avgBuyPrice: (
                asset.purchases.reduce(
                  (acc, purchase) => acc + Number(purchase.purchasePrice),
                  0
                ) / totalQuantity
              ).toFixed(2),

              allocation: (
                (Number(valueInBaseCurrencie) * 100) /
                Number(totalPortfolioValue)
              ).toFixed(2),
              price: Number(asset.assetPrice).toFixed(2),
              value: value.toFixed(2),
              valueInBaseCurrencie,
              valueChange: valueChange.toFixed(2),
              percentageChange: (
                (valueChange / totalPurchaseValue) *
                100
              ).toFixed(2),
              assetCurrencyCode: asset.currencyCode,
            }
          })
        )
      }
      return []
    },

    getPortfolioStats: async (
      portfolioId: number
    ): Promise<PortfolioStatsPublic> => {
      const portfolioAssets = await portfolioRepo.findFull(portfolioId)
      const portfolio = await portfolioRepo.findById(portfolioId)

      if (portfolioAssets && portfolio) {
        const totalPortfolioValue =
          await valueServices.getTotalValue(portfolioId)

        const groupedAssets = groupAssets(portfolioAssets)

        const totalPurchaseValueInPortfolioCurrency = await Promise.all(
          groupedAssets.map(async (asset) => {
            const exchangeData = await exchangeRateRepo.findRate({
              currencyFrom: portfolio.currencySymbol.toUpperCase(),
              currencyTo: asset.currencyCode,
            })

            const totalPurchaseValueInAssetCurrency = asset.purchases.reduce(
              (acc, purchase) => acc + Number(purchase.purchasePrice),
              0
            )

            return (
              totalPurchaseValueInAssetCurrency /
              Number(exchangeData?.exchangeRate)
            )
          })
        ).then((values) => values.reduce((acc, value) => acc + value, 0))

        const valueChange =
          Number(totalPortfolioValue) - totalPurchaseValueInPortfolioCurrency

        return {
          portfolioId,
          totalPortfolioValue,
          valueChange: valueChange.toFixed(2),
          percentageChange: (
            (valueChange / totalPurchaseValueInPortfolioCurrency) *
            100
          ).toFixed(2),
        }
      }
      return {
        portfolioId,
        totalPortfolioValue: '0.00',
        valueChange: '0.00',
        percentageChange: '00.0',
      }
    },
  }
}
