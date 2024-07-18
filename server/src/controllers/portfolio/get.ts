import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const portfolioCreated = await repos.portfolioRepository.findByUserId(
      authUser.id
    )
    return portfolioCreated
  })
