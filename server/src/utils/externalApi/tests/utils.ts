/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  fakeCryptosList,
  fakeCryptosPrices,
  fakeCurrencyExchangeRates,
  fakeFinancialData,
  fakeFundsList,
  fakeFundsPrices,
  fakeStocksList,
  fakeStocksPrices,
} from './fakes'

export const fakeFmp = () => ({
  fetchTimeRangePrices: vi.fn(async () => fakeFinancialData),
  fetchDayPrice: vi.fn(async () => [fakeFinancialData[0]]),
  fetchAllStocks: vi.fn(async () => fakeStocksList),
  fetchAllCryptos: vi.fn(async () => fakeCryptosList),
  fetchAllFunds: vi.fn(async () => fakeFundsList),
  fetchAllStocksPrices: vi.fn(async () => fakeStocksPrices),
  fetchAllCryptosPrices: vi.fn(async () => fakeCryptosPrices),
  fetchAllFundsPrices: vi.fn(async () => fakeFundsPrices),
})

export const fakeExchangeRatesApi = () => ({
  fetchRates: vi.fn(async (baseCodes: string[]) => fakeCurrencyExchangeRates),
})
