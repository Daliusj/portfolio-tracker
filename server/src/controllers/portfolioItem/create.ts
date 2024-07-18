import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioItemRepository }))
  .input(
    portfolioItemSchema.pick({
      quantity: true,
      assetId: true,
      portfolioId: true,
      purchaseDate: true,
      purchasePrice: true,
    })
  )
  .mutation(async ({ input: portfolioItemData, ctx: { repos } }) => {
    const portfolioCreated =
      await repos.portfolioItemRepository.create(portfolioItemData)
    return portfolioCreated
  })
