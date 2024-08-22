import provideServices from '@server/trpc/provideServices'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { portfolioValueSchema } from '@server/entities/portfolioValue'
import portfolioValueServices from '@server/services/portfolioValueServices'
import { isUserPortfolioOwner } from '@server/utils/isUserPortfolioOwner'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '@server/repositories/portfolioRepository'

export default authenticatedProcedure
  .use(provideServices({ portfolioValueServices }))
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioValueSchema.pick({
      portfolioId: true,
      type: true,
    })
  )
  .query(async ({ input: data, ctx: { authUser, services, repos } }) => {
    if (
      !isUserPortfolioOwner(
        data.portfolioId,
        authUser.id,
        repos.portfolioRepository
      )
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User do not have access to this portfolio.',
      })
    }

    const dataReturned =
      await services.portfolioValueServices.getAssetsTypeValue(
        data.portfolioId,
        data.type
      )
    return dataReturned
  })
