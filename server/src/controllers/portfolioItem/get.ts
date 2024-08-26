import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'
import { TRPCError } from '@trpc/server'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioItemRepository, portfolioRepository }))
  .input(
    portfolioItemSchema.pick({
      portfolioId: true,
    })
  )
  .query(async ({ input: portfolioItemData, ctx: { authUser, repos } }) => {
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
    const portfolioItemReturned =
      await repos.portfolioItemRepository.findByPortfolioId(
        portfolioItemData.portfolioId
      )

    return portfolioItemReturned
  })
