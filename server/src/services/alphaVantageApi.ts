import axios from 'axios'
import config from '@server/config'

interface FinancialData {
  date: string
  close: number
}

interface TimeSeriesData {
  [date: string]: {
    '1. open': string
    '2. high': string
    '3. low': string
    '4. close': string
    '5. volume'?: string
  }
}

interface CryptoTimeSeriesData {
  [date: string]: {
    '1a. open (USD)': string
    '2a. high (USD)': string
    '3a. low (USD)': string
    '4a. close (USD)': string
    '5. volume': string
    '6. market cap (USD)': string
  }
}

/**
 * Parses and filters time series data to the FinancialData format within a specified date range.
 * @param timeSeries The time series data object.
 * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
 * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
 * @param closeKey The key to access the close price in the time series data.
 * @returns An array of FinancialData objects.
 */
const parseTimeSeriesData = (
  timeSeries: Record<string, any>,
  dateFrom: string,
  dateTo: string,
  closeKey: string
): FinancialData[] =>
  Object.keys(timeSeries)
    .filter((date) => date >= dateFrom && date <= dateTo)
    .map((date) => ({
      date,
      close: parseFloat(timeSeries[date][closeKey]),
    }))

/**
 * Provides methods to fetch financial data from Alpha Vantage API.
 * @returns An object with methods to retrieve stock, crypto, and fund data.
 */
export default () => {
  /**
   * Retrieves aggregated stock data for a specific ticker within a date range.
   * @param ticker The stock ticker (e.g., AAPL, GOOGL).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to the filtered stock data.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchStockData = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<FinancialData[]> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          ticker,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: TimeSeriesData = response.data['Time Series (Daily)']
      return parseTimeSeriesData(timeSeries, dateFrom, dateTo, '4. close')
    } catch (err) {
      throw new Error(
        `Error fetching stock data for ${ticker}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  /**
   * Retrieves aggregated crypto data for a specific ticker within a date range.
   * @param ticker The crypto ticker (e.g., BTC, ETH).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @param market The market (e.g., USD).
   * @returns A Promise that resolves to the filtered crypto data.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchCryptoData = async (
    ticker: string,
    dateFrom: string,
    dateTo: string,
    market: string = 'USD'
  ): Promise<FinancialData[]> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'DIGITAL_CURRENCY_DAILY',
          ticker,
          market,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: CryptoTimeSeriesData =
        response.data['Time Series (Digital Currency Daily)']
      return parseTimeSeriesData(
        timeSeries,
        dateFrom,
        dateTo,
        '4a. close (USD)'
      )
    } catch (err) {
      throw new Error(
        `Error fetching crypto data for ${ticker}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  /**
   * Retrieves aggregated fund data for a specific ticker within a date range.
   * @param ticker The fund ticker (e.g., mutual funds, ETFs).
   * @param dateFrom The start date (inclusive) in YYYY-MM-DD format.
   * @param dateTo The end date (inclusive) in YYYY-MM-DD format.
   * @returns A Promise that resolves to the filtered fund data.
   * @throws Throws an error if fetching the data fails.
   */
  const fetchFundData = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<FinancialData[]> => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          ticker,
          apikey: config.alphaVantageApiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      const timeSeries: TimeSeriesData = response.data['Time Series (Daily)']
      return parseTimeSeriesData(timeSeries, dateFrom, dateTo, '4. close')
    } catch (err) {
      throw new Error(
        `Error fetching fund data for ${ticker}: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  return {
    fetchStockData,
    fetchCryptoData,
    fetchFundData,
  }
}
