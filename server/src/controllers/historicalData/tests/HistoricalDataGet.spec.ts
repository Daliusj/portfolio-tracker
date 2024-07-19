import { authContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import {
  fakeInputData,
  fakeFinancialData,
} from '@server/utils/externalApi/tests/fakes'
import historicalDataRouter from '..'

const createCaller = createCallerFactory(historicalDataRouter)
const db = {} as any
const fmp = fakeFmp()

it('should get asset data for one day', async () => {
  const { get } = createCaller(authContext({ db, fmp }))
  const returnedData = await get({
    symbol: 'AAPL',
    dateFrom: fakeInputData.dateFrom,
    dateTo: fakeInputData.dateTo,
  })

  expect(returnedData).toEqual(fakeFinancialData)
})
