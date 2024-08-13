import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import {
  portfolioSchema,
  type FullPortfolioGroupedPublic,
  type FullPortfolioPublic,
} from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

const groupAssets = (data: FullPortfolioPublic[]) => {
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

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema
      .pick({
        id: true,
      })
      .extend({ group: z.boolean().default(false) })
  )
  .query(async ({ input: inputData, ctx: { repos } }) => {
    const dataReturned = await repos.portfolioRepository.findFull(inputData.id)
    if (!dataReturned) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id.',
      })
    }

    if (inputData.group) {
      return groupAssets(dataReturned)
    }
    return dataReturned
  })
