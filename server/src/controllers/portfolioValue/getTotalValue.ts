import provideServices from '@server/trpc/provideServices'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { portfolioValueSchema } from '@server/entities/portfolioValue'
import portfolioValueServices from '@server/services/portfolioValueServices'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { portfolioRepository } from '../../repositories/portfolioRepository'

export default authenticatedProcedure
  .use(provideServices({ portfolioValueServices }))
  .use(provideRepos({ portfolioRepository }))
  .input(
    portfolioValueSchema.pick({
      portfolioId: true,
    })
  )
  .query(async ({ input: data, ctx: { services, repos } }) => {
    const portfolio = await repos.portfolioRepository.findById(data.portfolioId)
    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Portfolio not found with this id',
      })
    }

    const dataReturned = await services.portfolioValueServices.getTotalValue(
      data.portfolioId
    )
    return dataReturned
  })
