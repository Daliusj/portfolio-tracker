import type { Database } from '@server/database'
import { groupAssets } from '@server/utils/assets'
import { portfolioRepository } from '../repositories/portfolioRepository'
import portfolioValueServices from './portfolioValueServices'
import type { PortfolioStatsPublic } from './types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (db: Database) => {
  const portfolioRepo = portfolioRepository(db)
  const valueServices = portfolioValueServices(db, {} as any)

  return {
    getPortfolioStats: async (
      portfolioId: number
    ): Promise<PortfolioStatsPublic[]> => {
      const portfolioAssets = await portfolioRepo.findFull(portfolioId)
      const groupedAssets = groupAssets(portfolioAssets)
      const totalPortfolioValue = await valueServices.getTotalValue(portfolioId)

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
    },
  }
}
