import { authContext, requestContext } from '@tests/utils/context'
import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeAsset,
  fakeUser,
  fakePortfolio,
  fakePortfolioItem,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import portfolioValueRouter from '..'

const createCaller = createCallerFactory(portfolioValueRouter)
const fmp = {} as any
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { getTotalValue } = createCaller(requestContext({ db, fmp }))
  await expect(
    getTotalValue({
      portfolioId: 1,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should throw an error if user is not the portfolio owner', async () => {
  const [userOne, userTwo] = await insertAll(db, 'user', [
    fakeUser(),
    fakeUser(),
  ])

  const { getTotalValue } = createCaller(authContext({ db }, userTwo))

  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: userOne.id }),
  ])

  expect(
    getTotalValue({
      portfolioId: portfolio.id,
    })
  ).rejects.toThrow(/access/i)
})

it('should get total portfolio value', async () => {
  const [rateOne, rateTwo] = await insertAll(db, 'currencyExchangeRate', [
    {
      currencyFrom: 'EUR',
      currencyTo: 'USD',
      exchangeRate: 2,
    },
    {
      currencyFrom: 'EUR',
      currencyTo: 'EUR',
      exchangeRate: 1,
    },
  ])
  const [assetOne, assetTwo, assetThree] = await insertAll(db, 'asset', [
    fakeAsset({ type: 'fund', price: 100, exchangeShortName: 'NYSE' }),
    fakeAsset({ type: 'stock', price: 200, exchangeShortName: 'NASDAQ' }),
    fakeAsset({ type: 'stock', price: 300, exchangeShortName: 'EURONEXT' }),
  ])
  const [user] = await insertAll(db, 'user', fakeUser())

  const { getTotalValue } = createCaller(authContext({ db }, user))

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

  const returnedValue = await getTotalValue({
    portfolioId: portfolio.id,
  })

  expect(returnedValue).toEqual(
    (
      (Number(portfolioItemOne.quantity) * Number(assetOne.price)) /
        Number(rateOne.exchangeRate) +
      (Number(portfolioItemTwo.quantity) * Number(assetTwo.price)) /
        Number(rateOne.exchangeRate) +
      (Number(portfolioItemThree.quantity) * Number(assetThree.price)) /
        Number(rateTwo.exchangeRate)
    ).toFixed(2)
  )
})
