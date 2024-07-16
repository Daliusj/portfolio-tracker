import type { HistoricalData, FinancialData, Ticker } from '../fmpApi'
import { type CurrencyData } from '../exchangeRatesApi'

export const fakeTimeSeriesDataFmp: HistoricalData[] = [
  {
    date: '2023-07-01',
    open: 227.93,
    high: 229.4,
    low: 226.37,
    close: 103,
    adjClose: 228.68,
    volume: 48169822,
    unadjustedVolume: 48169822,
    change: 0.75,
    changePercent: 0.32905,
    vwap: 228.095,
    label: 'July 09, 24',
    changeOverTime: 0.0032905,
  },
  {
    date: '2023-06-30',
    open: 227.09,
    high: 227.85,
    low: 223.25,
    close: 102,
    adjClose: 227.82,
    volume: 59085861,
    unadjustedVolume: 59085861,
    change: 0.73,
    changePercent: 0.32146,
    vwap: 226.5025,
    label: 'July 08, 24',
    changeOverTime: 0.0032146,
  },
]

export const fakeFinancialData: FinancialData[] = [
  {
    date: '2023-07-01',
    closePrice: 103.0,
  },
  {
    date: '2023-06-30',
    closePrice: 102.0,
  },
]

export const fakeInputData = {
  dateFrom: '2023-06-30',
  dateTo: '2023-07-01',
}

export const fakeStocksList: Ticker[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 226.49,
    exchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ',
    type: 'stock',
  },
  {
    symbol: 'SW',
    name: 'Smurfit WestRock plc',
    price: 45.4,
    exchange: 'New York Stock Exchange',
    exchangeShortName: 'NYSE',
    type: 'stock',
  },
]
export const fakeFundsList: Ticker[] = [
  {
    symbol: 'GLOW',
    name: 'VictoryShares WestEnd Global Equity ETF',
    price: 25.4112,
    exchange: 'Nasdaq',
    exchangeShortName: 'NASDAQ',
    type: 'fund',
  },
  {
    symbol: 'BITS',
    name: 'Global X Blockchain & Bitcoin Strategy ETF',
    price: 66.74,
    exchange: 'NASDAQ Global Market',
    exchangeShortName: 'NASDAQ',
    type: 'fund',
  },
]
export const fakeCryptosList: Ticker[] = [
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin USD',
    price: 63677.82,
    exchange: '',
    exchangeShortName: 'CRYPTO',
    type: 'crypto',
  },
  {
    symbol: 'ETHUSD',
    name: 'Ethereum USD',
    price: 3413.35,
    exchange: '',
    exchangeShortName: 'CRYPTO',
    type: 'crypto',
  },
]

export const fakeStocksPrices = [
  {
    symbol: 'AAPL',
    price: 250.0,
  },
  {
    symbol: 'SW',
    price: 50.0,
  },
]
export const fakeFundsPrices = [
  {
    symbol: 'GLOW',
    price: 30.0,
  },
  {
    symbol: 'BITS',
    price: 70.0,
  },
]
export const fakeCryptosPrices = [
  {
    symbol: 'BTCUSD',
    price: 64000.0,
  },
  {
    symbol: 'ETHUSD',
    price: 3500.0,
  },
]

export const fakeCurrencyExchangeRates: CurrencyData[] = [
  {
    base: 'USD',
    rates: {
      EUR: 0.9,
      GBP: 0.8,
    },
  },
  {
    base: 'EUR',
    rates: {
      USD: 1.1,
      GBP: 0.9,
    },
  },
]
