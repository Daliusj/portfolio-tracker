import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { TRPCError } from '@trpc/server'
import { assetRepository } from '@server/repositories/assetRepository'
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
      id: true,
    })
  )
  .mutation(async ({ input: portfolioItemData, ctx: { authUser, repos } }) => {
    const portfolio = await repos.portfolioRepository.findById(
      portfolioItemData.portfolioId
    )
    const asset = await repos.assetRepository.findById(
      portfolioItemData.assetId
    )

    const portfolioItem = await repos.portfolioItemRepository.findById(
      portfolioItemData.id
    )

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id',
      })
    }

    if (
      portfolio &&
      !isUserPortfolioOwner(
        portfolio?.id,
        authUser.id,
        repos.portfolioRepository
      )
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

    if (!asset.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Asset not found with this id',
      })
    }

    if (!portfolioItem) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio item not found with this id',
      })
    }

    const portfolioCreated = await repos.portfolioItemRepository.update(
      { ...portfolioItemData },
      portfolioItemData.id
    )
    return portfolioCreated
  })
