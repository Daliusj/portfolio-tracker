import { parseSingleDayData, parseTimeSeriesData } from '../alphaVantageApi'
import { fakeTimeSeriesData, fakeFinancialData } from './alphaVantageFakes'

describe('parseSingleDayData', () => {
  it('should parse singleDayData to financialData', () => {
    const data = parseSingleDayData(fakeTimeSeriesData, '2024-07-07')
    expect(data).toEqual(fakeFinancialData[1])
  })
})

describe('parseTimeSeriesData', () => {
  it('should parse timeSeriesData to financialData', () => {
    const data = parseTimeSeriesData(
      fakeTimeSeriesData,
      '2024-07-07',
      '2024-07-08'
    )
    expect(data).toEqual(fakeFinancialData)
  })
})
