import type { Polygon } from './externalApi/polygonAPi'
import type { AlphaVantage } from './externalApi/alphaVantageApi'

export default function buildExternalApiServices(
  polygon: Polygon,
  alphaVantage: AlphaVantage
) {
  const getStockPricesForTimeRange = async (
    dateFrom: string,
    dateTo: string,
    symbol: string
  ): Promise<{ date: string; close: number }[]> => {
    try {
      const stockData = await polygon.fetchTimeRangeStockPrice(
        symbol,
        dateFrom,
        dateTo
      )
      return stockData
    } catch (polygonError) {
      try {
        const stockData = await alphaVantage.fetchTimeRangeStockPrice(
          symbol,
          dateFrom,
          dateTo
        )
        return stockData
      } catch (alphaVantageError) {
        throw new Error(
          `Failed to fetch stock prices from Polygon (${polygonError instanceof Error ? polygonError.message : 'An unknown error occurred'})
           and Alpha Vantage (${alphaVantageError instanceof Error ? alphaVantageError.message : 'An unknown error occurred'})`
        )
      }
    }
  }

  const getCryptoPricesForTimeRange = async (
    dateFrom: string,
    dateTo: string,
    symbol: string
  ): Promise<{ date: string; close: number }[]> => {
    try {
      const cryptoData = await polygon.fetchTimeRangeCryptoPrice(
        symbol,
        dateFrom,
        dateTo
      )
      return cryptoData
    } catch (polygonError) {
      try {
        const cryptoData = await alphaVantage.fetchTimeRangeCryptoPrice(
          symbol,
          dateFrom,
          dateTo
        )
        return cryptoData
      } catch (alphaVantageError) {
        throw new Error(
          `Failed to fetch stock prices from Polygon (${polygonError instanceof Error ? polygonError.message : 'An unknown error occurred'})
           and Alpha Vantage (${alphaVantageError instanceof Error ? alphaVantageError.message : 'An unknown error occurred'})`
        )
      }
    }
  }

  const getStockPrice = async (
    date: string,
    symbol: string
  ): Promise<{ date: string; close: number }> => {
    try {
      const [stockData] = await polygon.fetchDayStockPrice(symbol, date)
      return stockData
    } catch (polygonError) {
      try {
        const stockData = await alphaVantage.fetchDayStockPrice(symbol, date)
        return stockData
      } catch (alphaVantageError) {
        throw new Error(
          `Failed to fetch stock prices from Polygon (${polygonError instanceof Error ? polygonError.message : 'An unknown error occurred'})
           and Alpha Vantage (${alphaVantageError instanceof Error ? alphaVantageError.message : 'An unknown error occurred'})`
        )
      }
    }
  }

  const getCryptoPrice = async (
    date: string,
    symbol: string
  ): Promise<{ date: string; close: number }> => {
    try {
      const [cryptoData] = await polygon.fetchDayCryptoPrice(symbol, date)
      return cryptoData
    } catch (polygonError) {
      try {
        const cryptoData = await alphaVantage.fetchDayStockPrice(symbol, date)
        return cryptoData
      } catch (alphaVantageError) {
        throw new Error(
          `Failed to fetch stock prices from Polygon (${polygonError instanceof Error ? polygonError.message : 'An unknown error occurred'})
           and Alpha Vantage (${alphaVantageError instanceof Error ? alphaVantageError.message : 'An unknown error occurred'})`
        )
      }
    }
  }
  return {
    getCryptoPrice,
    getStockPrice,
    getCryptoPricesForTimeRange,
    getStockPricesForTimeRange,
  }
}
