/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FinancialData } from '../alphaVantageApi'

export const fakeTimeSeriesData = {
  '2024-07-08': {
    '1. open': '51589.15000000',
    '2. high': '51754.96000000',
    '3. low': '50916.33000000',
    '4. close': '51011.38000000',
    '5. volume': '31.60594154',
  },
  '2024-07-07': {
    '1. open': '53721.97000000',
    '2. high': '53861.02000000',
    '3. low': '51450.59000000',
    '4. close': '51589.15000000',
    '5. volume': '293.21157472',
  },
}

export const fakeFinancialData = [
  {
    date: '2024-07-08',
    close: 51011.38,
  },
  {
    date: '2024-07-07',
    close: 51589.15,
  },
]

export const fakeAlphaVantageWorking = () => {
  const mockStockData: FinancialData[] = [
    { date: '2023-07-01', close: 102.0 },
    { date: '2023-06-30', close: 103.0 },
  ]

  const mockCryptoData: FinancialData[] = [
    { date: '2023-07-01', close: 30500.0 },
    { date: '2023-06-30', close: 30000.0 },
  ]

  const fetchTimeRangeStockPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => mockStockData

  const fetchTimeRangeCryptoPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => mockCryptoData

  const fetchDayStockPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> => {
    const [data] = mockStockData
    return data
  }

  const fetchDayCryptoPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> => {
    const [data] = mockCryptoData
    return data
  }

  return {
    fetchDayCryptoPrice,
    fetchDayStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchTimeRangeStockPrice,
  }
}

export const fakeAlphaVantageNotWorking = () => {
  const mockError = (message: string) => {
    throw new Error(message)
  }
  const fetchTimeRangeStockPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => mockError('Failed to fetch stock data')

  const fetchTimeRangeCryptoPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => mockError('Failed to fetch crypto data')

  const fetchDayStockPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> =>
    mockError('Failed to fetch stock data for the day')

  const fetchDayCryptoPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> =>
    mockError('Failed to fetch crypto data for the day')

  return {
    fetchDayCryptoPrice,
    fetchDayStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchTimeRangeStockPrice,
  }
}
