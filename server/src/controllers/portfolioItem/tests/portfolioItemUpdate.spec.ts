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
  const { update } = createCaller(requestContext({ db }))
  await expect(
    update({
      id: 12,
      quantity: 1,
      assetId: 12,
      portfolioId: 34,
      purchaseDate: '2022-05-14',
      purchasePrice: 123.0,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should update portfolio item', async () => {
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
  const { update } = createCaller(authContext({ db }, user))
  const portfolioItemReturned = await update({
    id: portfolioItem.id,
    quantity: 2,
    assetId: asset.id,
    portfolioId: portfolio.id,
    purchaseDate: '2022-06-14',
    purchasePrice: 200.0,
  })

  expect(portfolioItemReturned).toMatchObject({
    id: portfolioItem.id,
    quantity: '2',
    assetId: asset.id,
    portfolioId: portfolio.id,
    purchaseDate: new Date(`2022-06-14 12:00:00`),
    purchasePrice: '200',
  })
})
