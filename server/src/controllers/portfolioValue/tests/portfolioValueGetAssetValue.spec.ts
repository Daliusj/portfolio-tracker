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
  const { getAssetValue } = createCaller(requestContext({ db, fmp }))
  await expect(
    getAssetValue({
      portfolioId: 1,
      assetId: 2,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should get total asset value by asset id', async () => {
  const [rateOne] = await insertAll(db, 'currencyExchangeRate', [
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
  const [assetOne, assetTwo] = await insertAll(db, 'asset', [
    fakeAsset({ type: 'fund', price: 100, exchangeShortName: 'NYSE' }),
    fakeAsset({ type: 'stock', price: 200, exchangeShortName: 'NASDAQ' }),
  ])
  const [user] = await insertAll(db, 'user', fakeUser())

  const { getAssetValue } = createCaller(authContext({ db }, user))

  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: user.id }),
  ])
  const [, portfolioItemTwo] = await insertAll(db, 'portfolioItem', [
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
  ])

  const returnedValue = await getAssetValue({
    portfolioId: portfolio.id,
    assetId: assetTwo.id,
  })

  expect(returnedValue).toEqual(
    Number(portfolioItemTwo.quantity) *
      Number(assetTwo.price) *
      Number(rateOne.exchangeRate)
  )
})
