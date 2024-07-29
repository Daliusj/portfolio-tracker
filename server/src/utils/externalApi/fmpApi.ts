import axios from 'axios'
import config from '@server/config'
import { format } from 'date-fns'
import type { InvestmentType } from '@server/database/types'

const STOCKS_LIST_URL = 'https://financialmodelingprep.com/api/v3/stock/list'
const FUNDS_LIST_URL = 'https://financialmodelingprep.com/api/v3/etf/list'
const CRYPTOS_LIST_URL =
  'https://financialmodelingprep.com/api/v3/symbol/available-cryptocurrencies'
const HISTORICAL_PRICES_URL =
  'https://financialmodelingprep.com/api/v3/historical-price-full'

const MAIN_CRYPTOS = [
  'BTCUSD', // Bitcoin
  'ETHUSD', // Ethereum
  'BNBUSD', // Binance Coin
  'USDTUSD', // Tether
  'ADAUSD', // Cardano
  'XRPUSD', // XRP
  'SOLUSD', // Solana
  'DOTUSD', // Polkadot
  'DOGEUSD', // Dogecoin
  'USDCUSD', // USD Coin
]

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
  price?: number
  exchange?: string
  exchangeShortName: string
  type: string
  stockExchange?: string
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
        apikey: apiKey,
      },
    })

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message'])
    }
    return response.data.historical
  } catch (err) {
    throw new Error(
      `FMP API Error fetching data for ${symbol}: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}

const fetchStocksAndETF = async (
  url: string,
  type: InvestmentType
): Promise<Ticker[]> => {
  try {
    const response = await axios.get(url, {
      params: {
        apikey: apiKey,
      },
    })

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message'])
    }

    return response.data.map((fullTicker: FullTicker) => ({
      symbol: fullTicker.symbol,
      name: fullTicker.name,
      type,
      exchange: fullTicker.exchange,
      exchangeShortName: fullTicker.exchangeShortName,
      price: fullTicker.price,
    }))
  } catch (err) {
    throw new Error(
      `FMP API Error fetching srtocks and funds list data: ${
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
  ): Promise<FinancialData[] | undefined> => {
    const data = await fetchPrices(symbol, fromDate, toDate)
    return data ? parseTimeSeriesData(data) : undefined
  }

  const fetchDayPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData[] | undefined> => {
    const data = await fetchPrices(symbol, date, date)
    return data ? parseTimeSeriesData(data) : undefined
  }

  const fetchAllStocks = async (): Promise<Ticker[]> => {
    const data = await fetchStocksAndETF(STOCKS_LIST_URL, 'stock')
    return data
  }

  const fetchAllFunds = async (): Promise<Ticker[]> => {
    const data = await fetchStocksAndETF(FUNDS_LIST_URL, 'fund')
    return data
  }

  const fetchAllStocksPrices = async () => {
    const stocks = await fetchAllStocks()
    return stocks.map((stock) => ({
      symbol: stock.symbol,
      price: stock.price,
    }))
  }
  const fetchAllFundsPrices = async () => {
    const stocks = await fetchAllFunds()
    return stocks.map((stock) => ({ symbol: stock.symbol, price: stock.price }))
  }

  const fetchCryptosFullListing = async (): Promise<FullTicker[]> => {
    try {
      const response = await axios.get(CRYPTOS_LIST_URL, {
        params: {
          apikey: apiKey,
        },
      })

      if (response.data['Error Message']) {
        throw new Error(response.data['Error Message'])
      }

      return response.data
    } catch (err) {
      throw new Error(
        `FMP API  Error fetching available cryptocurrencies: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  const fetchAllCryptos = async (): Promise<Ticker[]> => {
    const allCryptos = await fetchCryptosFullListing()

    const mainCryptos = allCryptos.filter((crypto) =>
      MAIN_CRYPTOS.includes(crypto.symbol)
    )
    const today = format(new Date(), 'yyyy-MM-dd')
    const pricePromises = MAIN_CRYPTOS.map(async (crypto) => {
      const [priceData] = await fetchPrices(crypto, today, today)
      return { symbol: crypto, price: priceData?.close || 0 }
    })

    const prices = await Promise.all(pricePromises)

    const mainCryptosWithPrices = mainCryptos.map((crypto) => {
      const priceData = prices.find((price) => price.symbol === crypto.symbol)
      return {
        symbol: crypto.symbol,
        name: crypto.name,
        type: 'crypto' as InvestmentType,
        exchange: crypto.stockExchange || 'CCC',
        exchangeShortName: crypto.exchangeShortName,
        price: priceData ? priceData.price : 0,
      }
    })

    return mainCryptosWithPrices
  }

  const fetchAllCryptosPrices = async () => {
    const stocks = await fetchAllCryptos()
    return stocks.map((stock) => ({ symbol: stock.symbol, price: stock.price }))
  }

  return {
    fetchDayPrice,
    fetchTimeRangePrices,
    fetchAllStocks,
    fetchAllCryptos,
    fetchAllFunds,
    fetchAllStocksPrices,
    fetchAllFundsPrices,
    fetchAllCryptosPrices,
  }
}

export type BuildFmp = typeof buildFmp
export type Fmp = ReturnType<BuildFmp>
