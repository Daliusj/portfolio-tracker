import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: portfolioData, ctx: { authUser, repos } }) => {
    const portfolioCreated = await repos.portfolioRepository.remove(
      portfolioData.id,
      authUser.id
    )
    return portfolioCreated
  })
