import provideRepos from '@server/trpc/provideRepos'
import { publicProcedure } from '@server/trpc'
import { assetRepository } from '@server/repositories/assetRepository'
import { assetIdArrSchema } from '@server/entities/asset'

export default publicProcedure
  .use(provideRepos({ assetRepository }))
  .input(
    assetIdArrSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: assetData, ctx: { repos } }) => {
    const portfolioCreated = await repos.assetRepository.findById(assetData.id)
    return portfolioCreated
  })
