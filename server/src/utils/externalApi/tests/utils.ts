/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FinancialData, Ticker } from '../fmpApi'
import { fakeAssetsList, fakeFinancialData } from './fakes'

export const fakeFmpWorking = () => {
  const fetchTimeRangePrices = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => fakeFinancialData

  const fetchDayPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData[]> => [fakeFinancialData[0]]

  const fetchAllStocks = async (): Promise<Ticker[]> => fakeAssetsList
  const fetchAllCryptos = async (): Promise<Ticker[]> => fakeAssetsList
  const fetchAllFunds = async (): Promise<Ticker[]> => fakeAssetsList

  return {
    fetchTimeRangePrices,
    fetchDayPrice,
    fetchAllStocks,
    fetchAllCryptos,
    fetchAllFunds,
  }
}

export const fakeFmpNotWorking = () => {
  const mockError = (message: string) => {
    throw new Error(message)
  }
  const fetchTimeRangePrices = async (
    symbol: string,
    fromDate: string,
    toDate: string
  ): Promise<FinancialData[]> => mockError('Failed to fetch data')

  const fetchDayPrice = async (
    symbol: string,
    date: string
  ): Promise<FinancialData[]> => mockError('Failed to fetch stock data')

  const fetchAllStocks = async (): Promise<Ticker[]> =>
    mockError('Failed to fetch data')

  const fetchAllCryptos = async (): Promise<Ticker[]> =>
    mockError('Failed to fetch data')

  const fetchAllFunds = async (): Promise<Ticker[]> =>
    mockError('Failed to fetch data')

  return {
    fetchAllCryptos,
    fetchAllFunds,
    fetchAllStocks,
    fetchDayPrice,
    fetchTimeRangePrices,
  }
}
