import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      currencySymbol: true,
    })
  )
  .mutation(async ({ input: portfolioData, ctx: { authUser, repos } }) => {
    const portfolio = {
      ...portfolioData,
      userId: authUser.id,
    }
    const portfolioCreated = await repos.portfolioRepository.create(portfolio)
    return portfolioCreated
  })
