import axios from 'axios'
import config from '@server/config'

export const CLOSE_KEY = '4. close'

export type FinancialData = {
  date: string
  close: number
}

type StockTimeSeriesData = {
  [date: string]: {
    '1. open': string
    '2. high': string
    '3. low': string
    '4. close': string
    '5. volume'?: string
  }
}

type CryptoTimeSeriesData = {
  [date: string]: {
    '1a. open': string
    '2a. high': string
    '3a. low': string
    '4a. close': string
    '5. volume': string
    '6. market cap (USD)': string
  }
}

/**
 * Parses and maps time series data to the FinancialData format for a single day.
 * @param timeSeries The time series data object.
 * @param date The date in YYYY-MM-DD format.
 * @param closeKey The key to access the close price in the time series data.
 * @returns A FinancialData object for the specified date.
 * @throws Throws an error if the date is not found in the time series data.
 */
export const parseSingleDayData = (
  timeSeries: Record<string, any>,
  date: string
): FinancialData => {
  if (!timeSeries[date]) {
    throw new Error(`Data for date ${date} not found`)
  }
  return {
    date,
    close: parseFloat(timeSeries[date][CLOSE_KEY]),
  }
}

/**
 * Parses and filters time series data to the FinancialData format within a specified date range.
 * @param timeSeries The time series data object.
 * @param fromDate The start date (inclusive) in YYYY-MM-DD format.
 * @param toDate The end date (inclusive) in YYYY-MM-DD format.
 * @param closeKey The key to access the close price in the time series data.
 * @returns An array of FinancialData objects.
 */
export const parseTimeSeriesData = (
  timeSeries: Record<string, any>,
  fromDate: string,
  toDate: string
): FinancialData[] =>
  Object.keys(timeSeries)
    .filter((date) => date >= fromDate && date <= toDate)
    .map((date) => ({
      date,
      close: parseFloat(timeSeries[date][CLOSE_KEY]),
    }))

/**
 * Provides methods to fetch financial data from Alpha Vantage API.
 * @returns An object with methods to retrieve stock, crypto, and fund data.
 */
export default function buildAlphaVantage() {
  /**
   * Retrieves aggregated stock data for a specific symbol within a date range.
   * @param symbol The stock symbol (e.g., AAPL, GOOGL).
   * @param fromDate The start date (inclusive) in YYYY-MM-DD format.
   * @param toDate The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to the filtered stock data.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchTimeRangeStockPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: StockTimeSeriesData =
        response.data['Time Series (Daily)']
      return parseTimeSeriesData(timeSeries, fromDate, toDate)
    } catch (err) {
      throw new Error(
        `Error fetching stock data for ${symbol}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  /**
   * Retrieves aggregated crypto data for a specific symbol within a date range.
   * @param symbol The crypto symbol (e.g., BTC, ETH).
   * @param fromDate The start date (inclusive) in YYYY-MM-DD format.
   * @param toDate The end date (inclusive) in YYYY-MM-DD format.
   * @param market The market (e.g., USD).
   * @returns A Promise that resolves to the filtered crypto data.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchTimeRangeCryptoPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string,
    market: string = 'USD'
  ): Promise<FinancialData[]> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'DIGITAL_CURRENCY_DAILY',
          symbol,
          market,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: CryptoTimeSeriesData =
        response.data['Time Series (Digital Currency Daily)']
      return parseTimeSeriesData(timeSeries, fromDate, toDate)
    } catch (err) {
      throw new Error(
        `Error fetching crypto data for ${symbol}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  /**
   * Retrieves the stock data for a specific symbol on a specific date.
   * @param symbol The stock symbol (e.g., AAPL, GOOGL).
   * @param date The date in YYYY-MM-DD format.
   * @returns A Promise that resolves to the stock data for the specified date.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchDayStockPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: StockTimeSeriesData =
        response.data['Time Series (Daily)']
      return parseSingleDayData(timeSeries, date)
    } catch (err) {
      throw new Error(
        `Error fetching stock data for ${symbol} on ${date}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  /**
   * Retrieves the crypto data for a specific symbol on a specific date.
   * @param symbol The crypto symbol (e.g., BTC, ETH).
   * @param date The date in YYYY-MM-DD format.
   * @param market The market (e.g., USD).
   * @returns A Promise that resolves to the crypto data for the specified date.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchDayCryptoPrice = async (
    symbol: string,
    date: string,
    market: string = 'USD'
  ): Promise<FinancialData> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'DIGITAL_CURRENCY_DAILY',
          symbol,
          market,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: CryptoTimeSeriesData =
        response.data['Time Series (Digital Currency Daily)']
      return parseSingleDayData(timeSeries, date)
    } catch (err) {
      throw new Error(
        `Error fetching crypto data for ${symbol} on ${date}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  return {
    fetchTimeRangeStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchDayStockPrice,
    fetchDayCryptoPrice,
  }
}

export type BuildAlphaVantage = typeof buildAlphaVantage
export type AlphaVantage = ReturnType<BuildAlphaVantage>
