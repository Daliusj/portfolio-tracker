import type { Database } from '@server/database'
import type { Fmp } from '../utils/externalApi/fmpApi'

export default (db: Database, fmpApi: Fmp) => ({
  getDataForTimeRange: async (
    symbol: string,
    dateFrom: string,
    dateTo: string
  ) => {
    try {
      const data = await fmpApi.fetchTimeRangePrices(symbol, dateFrom, dateTo)
      return data
    } catch (err) {
      throw new Error(
        `Error getting data from FmpApi: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  },
  getDataForOneDay: async (symbol: string, date: string) => {
    try {
      const data = await fmpApi.fetchDayPrice(symbol, date)
      return data
    } catch (err) {
      throw new Error(
        `Error getting data from FmpApi: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  },
})
