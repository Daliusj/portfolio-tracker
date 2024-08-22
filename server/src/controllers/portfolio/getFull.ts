import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { portfolioSchema } from '@server/entities/portfolio'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { groupAssets } from '@server/utils/assets'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'

export default authenticatedProcedure
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema
      .pick({
        id: true,
      })
      .extend({ group: z.boolean().default(false) })
  )
  .query(async ({ input: inputData, ctx: { authUser, repos } }) => {
    if (
      !isUserPortfolioOwner(
        inputData.id,
        authUser.id,
        repos.portfolioRepository
      )
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

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
