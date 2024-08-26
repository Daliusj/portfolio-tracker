import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { TRPCError } from '@trpc/server'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioItemRepository, portfolioRepository }))
  .input(
    portfolioItemSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: portfolioItemData, ctx: { authUser, repos } }) => {
    const portfolioItem = await repos.portfolioItemRepository.findById(
      portfolioItemData.id
    )

    if (
      portfolioItem &&
      !(await isUserPortfolioOwner(
        portfolioItem?.portfolioId,
        authUser.id,
        repos.portfolioRepository
      ))
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

    const itemDeleted = await repos.portfolioItemRepository.remove(
      portfolioItemData.id
    )

    if (!itemDeleted) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio item not found with this id',
      })
    }

    return itemDeleted
  })
