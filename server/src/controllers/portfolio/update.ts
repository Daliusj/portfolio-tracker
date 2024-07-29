import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      id: true,
      currencySymbol: true,
    })
  )
  .mutation(async ({ input: portfolioData, ctx: { authUser, repos } }) => {
    const portfolioUpdated = await repos.portfolioRepository.update(
      portfolioData.id,
      authUser.id,
      portfolioData.currencySymbol
    )
    if (!portfolioUpdated) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id.',
      })
    }

    return portfolioUpdated
  })
