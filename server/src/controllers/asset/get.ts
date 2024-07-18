import provideRepos from '@server/trpc/provideRepos'
import { publicProcedure } from '@server/trpc'
import { assetRepository } from '@server/repositories/assetRepository'
import { assetQuerySchema } from '@server/entities/asset'

export default publicProcedure
  .use(provideRepos({ assetRepository }))
  .input(
    assetQuerySchema.pick({
      query: true,
    })
  )
  .query(async ({ input: assetData, ctx: { repos } }) => {
    const portfolioCreated = await repos.assetRepository.findAsset(
      assetData.query
    )
    return portfolioCreated
  })
