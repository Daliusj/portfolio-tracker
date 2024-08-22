import { authContext, requestContext } from '@tests/utils/context'
import {
  fakeAsset,
  fakeExchange,
  fakePortfolio,
  fakePortfolioItem,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import portfolioItemRouter from '..'

const createCaller = createCallerFactory(portfolioItemRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { remove } = createCaller(requestContext({ db }))
  await expect(
    remove({
      id: 12,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should delete portfolio item', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const [asset] = await insertAll(
    db,
    'asset',
    fakeAsset({ exchangeShortName: exchange.shortName })
  )
  const [portfolioItem] = await insertAll(
    db,
    'portfolioItem',
    fakePortfolioItem({ portfolioId: portfolio.id, assetId: asset.id })
  )
  const { remove } = createCaller(authContext({ db }, user))
  const portfolioItemReturned = await remove({
    id: portfolioItem.id,
  })

  expect(portfolioItemReturned).toMatchObject({
    ...portfolioItem,
    id: portfolioItem.id,
  })
  const portfolioItemsOnDB = await selectAll(db, 'portfolioItem')
  expect(portfolioItemsOnDB).toEqual([])
})
