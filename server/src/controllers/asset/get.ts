import provideRepos from '@server/trpc/provideRepos'
import { publicProcedure } from '@server/trpc'
import { assetRepository } from '@server/repositories/assetRepository'
import { assetQuerySchema } from '@server/entities/asset'

export default publicProcedure
  .use(provideRepos({ assetRepository }))
  .input(
    assetQuerySchema.pick({
      query: true,
      offset: true,
      limit: true,
    })
  )
  .query(async ({ input: assetData, ctx: { repos } }) => {
    const returnedData = await repos.assetRepository.findAsset(
      assetData.query,
      { offset: assetData.offset, limit: assetData.limit }
    )

    return returnedData
  })
