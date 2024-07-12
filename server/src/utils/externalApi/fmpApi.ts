import axios from 'axios'
import config from '@server/config'
import type { InvestmentType } from '@server/database/types'

export const CLOSE_KEY = 'close'
const STOCKS_LIST_URL = 'https://financialmodelingprep.com/api/v3/stock/list'
const FUNDS_LIST_URL = 'https://financialmodelingprep.com/api/v3/etf/list'
const CRYPTOS_LIST_URL =
  'https://financialmodelingprep.com/api/v3/symbol/available-cryptocurrencies'
const HISTORICAL_PRICES_URL =
  'https://financialmodelingprep.com/api/v3/historical-price-full'

const apiKey = config.fmpApiKey

export type FinancialData = {
  date: string
  closePrice: number
}

export type Ticker = {
  symbol: string
  name: string
  type: InvestmentType
  exchange: string
  exchangeShortName: string
  price: number
}

type FullTicker = {
  symbol: string
  name: string
  price: number
  exchange: string
  exchangeShortName: string
  type: string
}

export type HistoricalData = {
  date: string
  open: number
  high: number
  low: number
  close: number
  adjClose: number
  volume: number
  unadjustedVolume: number
  change: number
  changePercent: number
  vwap: number
  label: string
  changeOverTime: number
}

export const parseSingleDayData = (
  timeSeries: HistoricalData
): FinancialData => ({
  date: timeSeries.date,
  closePrice: timeSeries.close,
})

export const parseTimeSeriesData = (
  timeSeries: HistoricalData[]
): FinancialData[] =>
  timeSeries.map((data: HistoricalData) => ({
    date: data.date,
    closePrice: data.close,
  }))

const fetchPrices = async (
  symbol: string,
  fromDate: string,
  toDate: string
): Promise<HistoricalData[]> => {
  try {
    const response = await axios.get(`${HISTORICAL_PRICES_URL}/${symbol}`, {
      params: {
        from: fromDate,
        to: toDate,
        apiKey,
      },
    })

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message'])
    }
    return response.data.historical
  } catch (err) {
    throw new Error(
      `Error fetching data for ${symbol}: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}

const fetchAllTickers = async (
  url: string,
  type: InvestmentType
): Promise<Ticker[]> => {
  try {
    const response = await axios.get(url, {
      params: {
        apiKey,
      },
    })

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message'])
    }

    return response.data.map((fullTicker: FullTicker) => ({
      symbol: fullTicker.symbol,
      name: fullTicker.name,
      type,
    }))
  } catch (err) {
    throw new Error(
      `Error fetching tickers list data: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}

export default function buildFmp() {
  const fetchTimeRangePrices = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => {
    const data = await fetchPrices(symbol, fromDate, toDate)
    return parseTimeSeriesData(data)
  }

  const fetchDayPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData[]> => {
    const data = await fetchPrices(symbol, date, date)
    return parseTimeSeriesData(data)
  }

  const fetchAllStocks = async (): Promise<Ticker[]> => {
    const data = await fetchAllTickers(STOCKS_LIST_URL, 'stock')
    return data
  }
  const fetchAllCryptos = async (): Promise<Ticker[]> => {
    const data = await fetchAllTickers(CRYPTOS_LIST_URL, 'crypto')
    return data
  }
  const fetchAllFunds = async (): Promise<Ticker[]> => {
    const data = await fetchAllTickers(FUNDS_LIST_URL, 'fund')
    return data
  }

  return {
    fetchDayPrice,
    fetchTimeRangePrices,
    fetchAllStocks,
    fetchAllCryptos,
    fetchAllFunds,
  }
}

export type BuildFmp = typeof buildFmp
export type Fmp = ReturnType<BuildFmp>
