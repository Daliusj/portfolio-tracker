import type {
  FullPortfolioPublic,
  FullPortfolioGroupedPublic,
} from '@server/entities/portfolio'

export const groupAssets = (data: FullPortfolioPublic[]) => {
  const groupedData = data.reduce((acc, row) => {
    let asset = acc.find((a) => Number(a.assetId) === row.assetId)
    if (!asset) {
      asset = {
        assetId: row.assetId,
        assetName: row.assetName,
        assetPrice: row.assetPrice,
        assetType: row.assetType,
        currencyCode: row.currencyCode,
        purchases: [],
      }
      acc.push(asset)
    }

    asset.purchases.push({
      portfolioItemId: row.portfolioItemId,
      quantity: row.quantity,
      purchaseDate: row.purchaseDate,
      purchasePrice: row.purchasePrice,
    })

    return acc
  }, [] as FullPortfolioGroupedPublic[])

  return groupedData
}
