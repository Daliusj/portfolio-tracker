import provideRepos from '@server/trpc/provideRepos'
import { publicProcedure } from '@server/trpc'
import { assetRepository } from '@server/repositories/assetRepository'

export default publicProcedure
  .use(provideRepos({ assetRepository }))
  .query(async ({ ctx: { repos } }) => {
    const portfolioCreated = await repos.assetRepository.findAll()
    return portfolioCreated
  })
