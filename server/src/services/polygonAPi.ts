import { restClient } from '@polygon.io/client-js'
import config from '@server/config'

interface AggregatedResult {
  v: number
  vw: number
  o: number
  c: number
  h: number
  l: number
  t: number
  n: number
}

interface AggregatedData {
  ticker: string
  status: string
  queryCount: number
  resultsCount: number
  adjusted: boolean
  results: AggregatedResult[]
}

interface ParsedData {
  date: string
  close: number
}

interface RestClient {
  stocks: {
    aggregates: (
      ticker: string,
      multiplier: number,
      timespan: string,
      from: string,
      to: string
    ) => Promise<AggregatedData>
  }
  crypto: {
    aggregates: (
      ticker: string,
      multiplier: number,
      timespan: string,
      from: string,
      to: string
    ) => Promise<AggregatedData>
  }
}

const rest = restClient(config.polygonApiKey) as RestClient

/**
 * Parses the aggregated data and returns an array of objects with date and close price.
 * @param data The aggregated data from the Polygon.io API.
 * @returns An array of objects with date and close price.
 */
const parseAggregatedData = (data: AggregatedData): ParsedData[] =>
  data.results.map((result) => ({
    date: new Date(result.t).toISOString().split('T')[0], // Convert timestamp to YYYY-MM-DD
    close: result.c,
  }))

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
   * @returns A Promise that resolves to an array of objects with date and close price.
   * @throws Throws an error if fetching the data fails.
   */
  getStockData: async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => {
    try {
      const data = await rest.stocks.aggregates(
        ticker,
        1,
        'day',
        dateFrom,
        dateTo
      )
      return parseAggregatedData(data)
    } catch (err) {
      throw new Error(
        `Failed to fetch from Polygon Stocks: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
      )
    }
  },

  /**
   * Retrieves aggregated crypto data for a specific ticker within a date range.
   * @param ticker The crypto ticker symbol (e.g., BTC, ETH).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to an array of objects with date and close price.
   * @throws Throws an error if fetching the data fails.
   */
  getCryptoData: async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => {
    try {
      const data = await rest.crypto.aggregates(
        ticker,
        1,
        'day',
        dateFrom,
        dateTo
      )
      return parseAggregatedData(data)
    } catch (err) {
      throw new Error(
        `Failed to fetch from Polygon Crypto: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
      )
    }
  },

  /**
   * Retrieves the close price of a stock for a specific date.
   * @param ticker The stock ticker symbol (e.g., AAPL, GOOGL).
   * @param date The specific date in YYYY-MM-DD format.
   * @returns A Promise that resolves to an array with a single object containing date and close price.
   * @throws Throws an error if fetching the data fails.
   */
  getStockClosePrice: async (
    ticker: string,
    date: string
  ): Promise<ParsedData[]> => {
    try {
      const data = await rest.stocks.aggregates(ticker, 1, 'day', date, date)
      if (data.results.length === 0) {
        throw new Error('No data available for the specified date')
      }
      return parseAggregatedData(data)
    } catch (err) {
      throw new Error(
        `Failed to fetch close price from Polygon Stocks: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
      )
    }
  },

  /**
   * Retrieves the close price of a crypto for a specific date.
   * @param ticker The crypto ticker symbol (e.g., BTC, ETH).
   * @param date The specific date in YYYY-MM-DD format.
   * @returns A Promise that resolves to an array with a single object containing date and close price.
   * @throws Throws an error if fetching the data fails.
   */
  getCryptoClosePrice: async (
    ticker: string,
    date: string
  ): Promise<ParsedData[]> => {
    try {
      const data = await rest.crypto.aggregates(ticker, 1, 'day', date, date)
      if (data.results.length === 0) {
        throw new Error('No data available for the specified date')
      }
      return parseAggregatedData(data)
    } catch (err) {
      throw new Error(
        `Failed to fetch close price from Polygon Crypto: ${err instanceof Error ? err.message : 'An unknown error occurred'}`
      )
    }
  },
})
