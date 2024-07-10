import { parseSingleDayData, parseTimeSeriesData } from '../fmpApi'
import { fakeTimeSeriesDataFmp, fakeFinancialData } from './fakes'

describe('parseSingleDayData', () => {
  it('should parse singleDayData to financialData', () => {
    const data = parseSingleDayData(fakeTimeSeriesDataFmp[0])
    expect(data).toEqual(fakeFinancialData[0])
  })
})

describe('parseTimeSeriesData', () => {
  it('should parse timeSeriesData to financialData', () => {
    const data = parseTimeSeriesData(fakeTimeSeriesDataFmp)
    expect(data).toEqual(fakeFinancialData)
  })
})
