import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { assetRepository } from '@server/repositories/assetRepository'
import { TRPCError } from '@trpc/server'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'
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
  .mutation(async ({ input: portfolioItemData, ctx: { authUser, repos } }) => {
    if (
      !(await isUserPortfolioOwner(
        portfolioItemData.portfolioId,
        authUser.id,
        repos.portfolioRepository
      ))
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }
    const asset = await repos.assetRepository.findById(
      portfolioItemData.assetId
    )

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
