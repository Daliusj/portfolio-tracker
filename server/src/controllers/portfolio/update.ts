import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      id: true,
      currencySymbol: true,
      name: true,
    })
  )
  .mutation(async ({ input: portfolioData, ctx: { authUser, repos } }) => {
    if (
      !(await isUserPortfolioOwner(
        portfolioData.id,
        authUser.id,
        repos.portfolioRepository
      ))
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

    const portfolioUpdated = await repos.portfolioRepository.update(
      portfolioData.id,
      authUser.id,
      portfolioData.currencySymbol,
      portfolioData.name
    )

    return portfolioUpdated
  })
