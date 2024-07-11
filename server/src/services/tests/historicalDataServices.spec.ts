import {
  fakeFmpWorking,
  fakeFmpNotWorking,
} from '@server/utils/externalApi/tests/utils'
import {
  fakeFinancialData,
  fakeInputData,
} from '@server/utils/externalApi/tests/fakes'
import historicalDataServices from '../historicalDataServices'

const fmpWorking = fakeFmpWorking()
const fmpNotWorking = fakeFmpNotWorking()

const servicesWorking = historicalDataServices(fmpWorking)
const servicesNotWorking = historicalDataServices(fmpNotWorking)

describe('getDataForTimeRange', () => {
  it('should fetch asset data for a date range when API is working', async () => {
    const data = await servicesWorking.getDataForTimeRange(
      'AAPL',
      fakeInputData.dateFrom,
      fakeInputData.dateTo
    )
    expect(data).toEqual(fakeFinancialData)
  })

  it('should throw an error when API is not working', async () => {
    await expect(
      servicesNotWorking.getDataForTimeRange(
        'AAPL',
        fakeInputData.dateFrom,
        fakeInputData.dateTo
      )
    ).rejects.toThrow()
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

  it('should throw an error when API is not working', async () => {
    await expect(
      servicesNotWorking.getDataForOneDay('AAPL', fakeInputData.dateFrom)
    ).rejects.toThrow()
  })
})
