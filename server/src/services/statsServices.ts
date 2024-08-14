import type { Database } from '@server/database'
import { groupAssets } from '@server/utils/assets'
import { portfolioRepository } from '../repositories/portfolioRepository'
import portfolioValueServices from './portfolioValueServices'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (db: Database) => {
  const portfolioRepo = portfolioRepository(db)
  const valueServices = portfolioValueServices(db, {} as any)
  return {
    getPortfolioStats: async (portfolioId: number) => {
      const portfolioAssets = await portfolioRepo.findFull(portfolioId)
      const groupedAssets = groupAssets(portfolioAssets)
      const totalPortfolioValue = await valueServices.getTotalValue(portfolioId)
      return groupedAssets.map(async (asset) => {
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
          name: asset.assetName,
          totalQuantity,
          avgBuyPrice:
            asset.purchases.reduce(
              (acc, purchase) => acc + Number(purchase.purchasePrice),
              0
            ) / totalQuantity,

          allocation: (
            (Number(valueInBaseCurrencie) * 100) /
            Number(totalPortfolioValue)
          ).toFixed(2),
          price: asset.assetPrice,
          value,
          valueInBaseCurrencie,
          valueChange,
          percentageChange: ((valueChange / totalPurchaseValue) * 100).toFixed(
            1
          ),
        }
      })
    },
  }
}
