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
import { insertAll } from '@tests/utils/records'
import portfolioItemRouter from '..'

const createCaller = createCallerFactory(portfolioItemRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { get } = createCaller(requestContext({ db }))
  await expect(get({ portfolioId: 34 })).rejects.toThrow(/unauthenticated/i)
})

it('should get all portfolioItems', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const [assetOne, assetTwo] = await insertAll(db, 'asset', [
    fakeAsset({ exchangeShortName: exchange.shortName }),
    fakeAsset({ exchangeShortName: exchange.shortName }),
  ])
  const [portfolioItemOne, portfolioItemTwo] = await insertAll(
    db,
    'portfolioItem',
    [
      fakePortfolioItem({ portfolioId: portfolio.id, assetId: assetOne.id }),
      fakePortfolioItem({ portfolioId: portfolio.id, assetId: assetTwo.id }),
    ]
  )
  const { get } = createCaller(authContext({ db }, user))
  const portfolioReturned = await get({ portfolioId: portfolio.id })

  expect(portfolioReturned).toEqual([portfolioItemOne, portfolioItemTwo])
})
