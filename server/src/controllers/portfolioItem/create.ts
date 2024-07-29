import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { assetRepository } from '@server/repositories/assetRepository'
import { TRPCError } from '@trpc/server'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'
import { portfolioRepository } from '../../repositories/portfolioRepository'

export default authenticatedProcedure
  .use(
    provideRepos({
      portfolioItemRepository,
      portfolioRepository,
      assetRepository,
    })
  )
  .input(
    portfolioItemSchema.pick({
      quantity: true,
      assetId: true,
      portfolioId: true,
      purchaseDate: true,
      purchasePrice: true,
    })
  )
  .mutation(async ({ input: portfolioItemData, ctx: { repos } }) => {
    const portfolio = await repos.portfolioRepository.findById(
      portfolioItemData.portfolioId
    )
    const asset = await repos.assetRepository.findById(
      portfolioItemData.assetId
    )

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id',
      })
    }

    if (!asset.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Asset not found with this id',
      })
    }

    const portfolioCreated =
      await repos.portfolioItemRepository.create(portfolioItemData)

    return portfolioCreated
  })
