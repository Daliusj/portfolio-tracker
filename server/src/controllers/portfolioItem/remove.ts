import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioItemSchema } from '@server/entities/portfolioItems'
import { TRPCError } from '@trpc/server'
import { portfolioItemRepository } from '../../repositories/portfolioItemRepository'

export default authenticatedProcedure
  .use(provideRepos({ portfolioItemRepository }))
  .input(
    portfolioItemSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: portfolioItemData, ctx: { repos } }) => {
    const itemDeleted = await repos.portfolioItemRepository.remove(
      portfolioItemData.id
    )

    if (!itemDeleted) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio item not found with this id',
      })
    }

    return itemDeleted
  })
