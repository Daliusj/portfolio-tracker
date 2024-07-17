import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import {
  fakeFinancialData,
  fakeInputData,
} from '@server/utils/externalApi/tests/fakes'
import historicalDataServices from '../historicalDataServices'

const fmpApi = fakeFmp()
const db = {} as any

const servicesWorking = historicalDataServices(db, fmpApi)

describe('getDataForTimeRange', () => {
  it('should fetch asset data for a date range when API is working', async () => {
    const data = await servicesWorking.getDataForTimeRange(
      'AAPL',
      fakeInputData.dateFrom,
      fakeInputData.dateTo
    )
    expect(data).toEqual(fakeFinancialData)
  })
})

describe('getDataForOneDay', () => {
  it('should fetch asset data when API is working', async () => {
    const data = await servicesWorking.getDataForOneDay(
      'AAPL',
      fakeInputData.dateFrom
    )
    expect(data).toEqual([fakeFinancialData[0]])
  })
})
