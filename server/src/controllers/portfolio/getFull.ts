import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: portfolioData, ctx: { repos } }) => {
    const dataReturned = await repos.portfolioRepository.findFull(
      portfolioData.id
    )
    if (!dataReturned) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id.',
      })
    }

    return dataReturned
  })
