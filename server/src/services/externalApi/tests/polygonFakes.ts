/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, vi } from 'vitest'
import type { ParsedData, AggregatedResult, Polygon } from '../polygonAPi'

export const fakeAggregatedResult: AggregatedResult[] = [
  {
    v: 1000,
    vw: 101.5,
    o: 101,
    c: 102,
    h: 103,
    l: 100,
    t: 1688150400000,
    n: 1,
  },
]

export const fakeParsedData: ParsedData[] = [
  {
    date: '2023-06-30',
    close: 102.0,
  },
]
const mockStockData = (dateFrom: string, dateTo: string): ParsedData[] => [
  { date: dateFrom, close: 102.0 },
  { date: dateTo, close: 103.0 },
]

const mockCryptoData = (dateFrom: string, dateTo: string): ParsedData[] => [
  { date: dateFrom, close: 30500.0 },
  { date: dateTo, close: 30000.0 },
]

export const fakePolygonWorking = () => {
  const fetchTimeRangeStockPrice = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => mockStockData(dateFrom, dateTo)

  const fetchTimeRangeCryptoPrice = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => mockCryptoData(dateFrom, dateTo)

  const fetchDayStockPrice = async (
    ticker: string,
    date: string
  ): Promise<ParsedData> => {
    const [data] = mockStockData(date, date)
    return data
  }

  const fetchDayCryptoPrice = async (
    ticker: string,
    date: string
  ): Promise<ParsedData> => {
    const [data] = mockCryptoData(date, date)
    return data
  }

  return {
    fetchDayCryptoPrice,
    fetchDayStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchTimeRangeStockPrice,
  }
}

const fakePolygonNotWorking = () => {
  const mockError = (message: string) => {
    throw new Error(message)
  }

  const fetchTimeRangeStockPrice = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => mockError('Failed to fetch stock data')

  const fetchTimeRangeCryptoPrice = async (
    ticker: string,
    dateFrom: string,
    dateTo: string
  ): Promise<ParsedData[]> => mockError('Failed to fetch crypto data')

  const fetchDayStockPrice = async (
    ticker: string,
    date: string
  ): Promise<ParsedData> => mockError('Failed to fetch stock data for the day')

  const fetchDayCryptoPrice = async (
    ticker: string,
    date: string
  ): Promise<ParsedData> => mockError('Failed to fetch crypto data for the day')

  return {
    fetchDayCryptoPrice,
    fetchDayStockPrice,
    fetchTimeRangeCryptoPrice,
    fetchTimeRangeStockPrice,
  }
}
