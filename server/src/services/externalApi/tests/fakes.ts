/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FinancialData } from '..'
import type { AggregatedResult } from '../polygonAPi'
import type { HistoricalData } from '../fmpApi'

export const fakeAggregatedResult: AggregatedResult[] = [
  {
    v: 1000,
    vw: 101.5,
    o: 101,
    c: 103,
    h: 103,
    l: 100,
    t: 1688196439000,
    n: 1,
  },
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

export const fakeTimeSeriesDataAlphaVantage = {
  '2023-07-01': {
    '1. open': '51589.15000000',
    '2. high': '51754.96000000',
    '3. low': '50916.33000000',
    '4. close': '103.0',
    '5. volume': '31.60594154',
  },
  '2023-06-30': {
    '1. open': '53721.97000000',
    '2. high': '53861.02000000',
    '3. low': '51450.59000000',
    '4. close': '102.0',
    '5. volume': '293.21157472',
  },
}

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

export const fakeAsset = {
  name: 'Apple',
  Symbol: 'AAPL',
}
