import provideServices from '@server/trpc/provideServices'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import statsServices from '@server/services/statsServices'
import { portfolioSchema } from '@server/entities/portfolio'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'
import { portfolioRepository } from '../../repositories/portfolioRepository'

export default authenticatedProcedure
  .use(provideServices({ statsServices }))
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: data, ctx: { authUser, services, repos } }) => {
    if (
      !isUserPortfolioOwner(data.id, authUser.id, repos.portfolioRepository)
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

    const portfolio = await repos.portfolioRepository.findById(data.id)
    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id',
      })
    }

    const dataReturned = await services.statsServices.getPortfolioStats(data.id)
    return dataReturned
  })
