import {
  fakeFmp,
  fakeFmpNotWorking,
} from '@server/utils/externalApi/tests/utils'
import {
  fakeFinancialData,
  fakeInputData,
} from '@server/utils/externalApi/tests/fakes'
import historicalDataServices from '../historicalDataServices'

const fmpApi = fakeFmp()
const fmpApiNotWorking = fakeFmpNotWorking()
const db = {} as any

const services = historicalDataServices(db, fmpApi)
const servicesNotWorking = historicalDataServices(db, fmpApiNotWorking)

describe('getDataForTimeRange', () => {
  it('should fetch asset data for a date range when API is working', async () => {
    const data = await services.getDataForTimeRange(
      'AAPL',
      fakeInputData.dateFrom,
      fakeInputData.dateTo
    )
    expect(data).toEqual(fakeFinancialData)
  })

  it('should return empty array if there is no data for specified time range', async () => {
    const data = await services.getDataForTimeRange(
      'AAPL',
      '2100-12-12',
      '2100-12-20'
    )
    expect(data).toEqual([])
  })

  it('should throw an error if Fmp Api is not working', async () => {
    await expect(servicesNotWorking.getDataForTimeRange).rejects.toThrow(
      /FMP API Error/i
    )
  })
})

describe('getDataForOneDay', () => {
  it('should fetch asset data when API is working', async () => {
    const data = await services.getDataForOneDay('AAPL', fakeInputData.dateTo)
    expect(data).toEqual([fakeFinancialData[0]])
  })

  it('should return empty array if there is no data for specified date', async () => {
    const data = await services.getDataForOneDay('AAPL', '2100-12-12')
    expect(data).toEqual([])
  })

  it('should throw an error if Fmp Api is not working', async () => {
    await expect(servicesNotWorking.getDataForOneDay).rejects.toThrow(
      /FMP API Error/i
    )
  })
})
