import { authContext } from '@tests/utils/context'
import { fakeAsset, fakeExchange } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should get an asset by id', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const [asset] = await insertAll(
    db,
    'asset',
    fakeAsset({ exchangeShortName: exchange.shortName })
  )
  const { getById } = createCaller(authContext({ db }))
  const assetReturned = await getById({ id: [asset.id] })
  expect(assetReturned).toEqual([asset])
})

it('should get an assets by array of ids', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const [assetOne, assetTwo] = await insertAll(db, 'asset', [
    fakeAsset({ exchangeShortName: exchange.shortName }),
    fakeAsset({ exchangeShortName: exchange.shortName }),
  ])
  const { getById } = createCaller(authContext({ db }))
  const assetReturned = await getById({ id: [assetOne.id, assetTwo.id] })
  expect(assetReturned).toEqual([assetOne, assetTwo])
})
