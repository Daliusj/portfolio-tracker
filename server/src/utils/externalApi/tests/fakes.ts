import type { HistoricalData, FinancialData } from '../fmpApi'

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
