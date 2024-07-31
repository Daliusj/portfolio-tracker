import { publicProcedure } from '@server/trpc'
import provideServices from '@server/trpc/provideServices'
import historicalDataServices from '@server/services/historicalDataServices'
import { historicalDataSchema } from '@server/entities/historicalData'

export default publicProcedure
  .use(provideServices({ historicalDataServices }))
  .input(
    historicalDataSchema.pick({
      symbol: true,
      dateFrom: true,
      dateTo: true,
    })
  )
  .query(async ({ input: data, ctx: { services } }) => {
    const dataReturned =
      await services.historicalDataServices.getDataForTimeRange(
        data.symbol,
        data.dateFrom,
        data.dateTo
      )
    return dataReturned
  })
