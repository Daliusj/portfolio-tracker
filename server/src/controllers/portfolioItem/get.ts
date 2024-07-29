import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { TRPCError } from '@trpc/server'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioItemRepository }))
  .input(
    portfolioItemSchema.pick({
      portfolioId: true,
    })
  )
  .query(async ({ input: portfolioItemData, ctx: { repos } }) => {
    const portfolioItemReturned =
      await repos.portfolioItemRepository.findByPortfolioId(
        portfolioItemData.portfolioId
      )
    if (!portfolioItemReturned.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio items not found for this portfolio',
      })
    }

    return portfolioItemReturned
  })
