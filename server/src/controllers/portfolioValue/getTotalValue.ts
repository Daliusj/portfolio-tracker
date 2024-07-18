import provideServices from '@server/trpc/provideServices'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { portfolioValueSchema } from '@server/entities/portfolioValue'
import portfolioValueServices from '@server/services/portfolioValueServices'

export default authenticatedProcedure
  .use(provideServices({ portfolioValueServices }))
  .input(
    portfolioValueSchema.pick({
      portfolioId: true,
    })
  )
  .query(async ({ input: data, ctx: { services } }) => {
    const dataReturned = await services.portfolioValueServices.getTotalValue(
      data.portfolioId
    )
    return dataReturned
  })
