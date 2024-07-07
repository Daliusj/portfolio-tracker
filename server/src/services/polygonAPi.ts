import { restClient } from '@polygon.io/client-js'
import config from '@server/config'

const rest = restClient(config.polygonApiKey)

/**
 * Provides methods to fetch data from Polygon.io API.
 * @returns An object with methods to retrieve stock and crypto data.
 */
export default () => ({
  /**
   * Retrieves aggregated stock data for a specific ticker within a date range.
   * @param ticker The stock ticker symbol (e.g., AAPL, GOOGL).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to the aggregated stock data.
   * @throws Throws an error if fetching the data fails.
   */
  getStockData: async (ticker: string, dateFrom: string, dateTo: string) => {
    rest.stocks
      .aggregates(ticker, 1, 'day', dateFrom, dateTo)
      .then((data) => data)
      .catch((err) => {
        throw new Error(
          `Failed to fetch from Polygon Stocks: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
        )
      })
  },

  /**
   * Retrieves aggregated crypto data for a specific ticker within a date range.
   * @param ticker The crypto ticker symbol (e.g., BTC, ETH).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to the aggregated crypto data.
   * @throws Throws an error if fetching the data fails.
   */
  getCryptoData: async (ticker: string, dateFrom: string, dateTo: string) => {
    rest.crypto
      .aggregates(ticker, 1, 'day', dateFrom, dateTo)
      .then((data) => data)
      .catch((err) => {
        throw new Error(
          `Failed to fetch from Polygon Crypto: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
        )
      })
  },
})
