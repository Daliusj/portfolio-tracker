import { authContext, requestContext } from '@tests/utils/context'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { getFull } = createCaller(requestContext({ db }))
  await expect(getFull({ id: 1 })).rejects.toThrow(/unauthenticated/i)
})

it('should get a full assets data of portfolio with provided id', async () => {
  const [assetOne, assetTwo, assetThree] = await insertAll(db, 'asset', [
    fakeAsset({ type: 'fund', price: 100, exchangeShortName: 'NYSE' }),
    fakeAsset({ type: 'stock', price: 200, exchangeShortName: 'NASDAQ' }),
    fakeAsset({ type: 'stock', price: 300, exchangeShortName: 'Euronext' }),
  ])
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: user.id }),
  ])
  const [portfolioItemOne, portfolioItemTwo, portfolioItemThree] =
    await insertAll(db, 'portfolioItem', [
      fakePortfolioItem({
        portfolioId: portfolio.id,
        assetId: assetOne.id,
        purchasePrice: 150,
        quantity: 2,
      }),
      fakePortfolioItem({
        portfolioId: portfolio.id,
        assetId: assetTwo.id,
        purchasePrice: 500,
        quantity: 4,
      }),
      fakePortfolioItem({
        portfolioId: portfolio.id,
        assetId: assetThree.id,
        purchasePrice: 1200,
        quantity: 6,
      }),
    ])
  const { getFull } = createCaller(authContext({ db }, user))
  const portfolioDataReturned = await getFull({ id: portfolio.id })
  expect(portfolioDataReturned).toEqual([
    {
      id: assetOne.id,
      name: assetOne.name,
      price: assetOne.price,
      type: assetOne.type,
      quantity: portfolioItemOne.quantity,
      currencyCode: 'USD',
    },
    {
      id: assetTwo.id,
      name: assetTwo.name,
      price: assetTwo.price,
      type: assetTwo.type,
      quantity: portfolioItemTwo.quantity,
      currencyCode: 'USD',
    },
    {
      id: assetThree.id,
      name: assetThree.name,
      price: assetThree.price,
      type: assetThree.type,
      quantity: portfolioItemThree.quantity,
      currencyCode: 'EUR',
    },
  ])
})
