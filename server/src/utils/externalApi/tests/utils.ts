/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FinancialData } from '../fmpApi'
import { fakeFinancialData } from './fakes'

export const fakeFmpWorking = () => {
  const fetchTimeRangeStockPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => fakeFinancialData

  const fetchTimeRangeCryptoPrice = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => fakeFinancialData

  const fetchDayStockPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> => {
    const [data] = fakeFinancialData
    return data
  }

  const fetchDayCryptoPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData> => {
    const [data] = fakeFinancialData
    return data
  }

  const fetchAllStocks = async () => {}
  const fetchAllCrypto = async () => {}
  const fetchAllFunds = async () => {}
  const searchSymbols = async () => {}

  return {
    fetchDayCryptoPrice,
    fetchDayStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchTimeRangeStockPrice,
    fetchAllCrypto,
    fetchAllFunds,
    fetchAllStocks,
    searchSymbols,
  }
}

export const fakeFmpNotWorking = () => {
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
