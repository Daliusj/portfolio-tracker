import { authContext } from '@tests/utils/context'
import { fakeAsset, fakeExchange } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should get an asset by query', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const asset = await insertAll(
    db,
    'asset',
    fakeAsset({ symbol: 'AAPL', exchangeShortName: exchange.shortName })
  )
  const { get } = createCaller(authContext({ db }))
  const assetReturned = await get({ query: 'apl' })
  expect(assetReturned).toEqual({ data: asset, total: '1' })
})
