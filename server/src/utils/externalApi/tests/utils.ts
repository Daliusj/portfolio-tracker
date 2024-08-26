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
  fetchTimeRangePrices: vi.fn(
    async (symbol: string, fromDate: string, toDate: string) =>
      fakeFinancialData.filter(({ date }) => {
        const itemDate = new Date(date)
        return itemDate >= new Date(fromDate) && itemDate <= new Date(toDate)
      })
  ),
  fetchDayPrice: vi.fn(async (symbol: string, date: string) =>
    fakeFinancialData.filter(
      ({ date: itemDate }) =>
        new Date(itemDate).getTime() === new Date(date).getTime()
    )
  ),
  fetchAllStocks: vi.fn(async () => fakeStocksList),
  fetchAllCryptos: vi.fn(async () => fakeCryptosList),
  fetchAllFunds: vi.fn(async () => fakeFundsList),
  fetchAllStocksPrices: vi.fn(async () => fakeStocksPrices),
  fetchAllCryptosPrices: vi.fn(async () => fakeCryptosPrices),
  fetchAllFundsPrices: vi.fn(async () => fakeFundsPrices),
})

export const fakeFmpNotWorking = () => ({
  fetchTimeRangePrices: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchDayPrice: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllStocks: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllCryptos: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllFunds: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllStocksPrices: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllCryptosPrices: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
  fetchAllFundsPrices: vi.fn(async () => {
    throw new Error(`FMP API Error fetching data`)
  }),
})

export const fakeExchangeRatesApi = () => ({
  fetchRates: vi.fn(async (baseCodes: string[]) => fakeCurrencyExchangeRates),
})
export const fakeExchangeRatesApiNotWorking = () => ({
  fetchRates: vi.fn(async (baseCodes: string[]) => {
    throw new Error(`Error fetching currency exchange rates`)
  }),
})
