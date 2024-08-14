import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { groupAssets } from '@server/utils/assets'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema
      .pick({
        id: true,
      })
      .extend({ group: z.boolean().default(false) })
  )
  .query(async ({ input: inputData, ctx: { repos } }) => {
    const dataReturned = await repos.portfolioRepository.findFull(inputData.id)
    if (!dataReturned) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id.',
      })
    }

    if (inputData.group) {
      return groupAssets(dataReturned)
    }
    return dataReturned
  })
