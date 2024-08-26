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

it('should throw an error if user is not the portfolio owner', async () => {
  const [userOne, userTwo] = await insertAll(db, 'user', [
    fakeUser(),
    fakeUser(),
  ])
  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: userOne.id }),
  ])
  const { getFull } = createCaller(authContext({ db }, userTwo))
  expect(getFull({ id: portfolio.id })).rejects.toThrow(/access/i)
})

it('should get a full assets data of portfolio with provided id', async () => {
  const [assetOne, assetTwo, assetThree] = await insertAll(db, 'asset', [
    fakeAsset({ type: 'fund', price: 100, exchangeShortName: 'NYSE' }),
    fakeAsset({ type: 'stock', price: 200, exchangeShortName: 'NASDAQ' }),
    fakeAsset({ type: 'stock', price: 300, exchangeShortName: 'EURONEXT' }),
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
      assetId: assetOne.id,
      assetName: assetOne.name,
      assetPrice: assetOne.price,
      assetType: assetOne.type,
      quantity: portfolioItemOne.quantity,
      currencyCode: 'USD',
      portfolioItemId: portfolioItemOne.id,
      purchaseDate: portfolioItemOne.purchaseDate,
      purchasePrice: portfolioItemOne.purchasePrice,
    },
    {
      assetId: assetTwo.id,
      assetName: assetTwo.name,
      assetPrice: assetTwo.price,
      assetType: assetTwo.type,
      quantity: portfolioItemTwo.quantity,
      currencyCode: 'USD',
      portfolioItemId: portfolioItemTwo.id,
      purchaseDate: portfolioItemTwo.purchaseDate,
      purchasePrice: portfolioItemTwo.purchasePrice,
    },
    {
      assetId: assetThree.id,
      assetName: assetThree.name,
      assetPrice: assetThree.price,
      assetType: assetThree.type,
      quantity: portfolioItemThree.quantity,
      currencyCode: 'EUR',
      portfolioItemId: portfolioItemThree.id,
      purchaseDate: portfolioItemThree.purchaseDate,
      purchasePrice: portfolioItemThree.purchasePrice,
    },
  ])
})

it('should get a full assets data grouped by assets name of portfolio with provided id', async () => {
  const [assetOne, assetTwo] = await insertAll(db, 'asset', [
    fakeAsset({ type: 'fund', price: 100, exchangeShortName: 'NYSE' }),
    fakeAsset({
      type: 'stock',
      price: 250,
      exchangeShortName: 'NASDAQ',
      name: 'TestStock',
    }),
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
        purchasePrice: 260,
        quantity: 4,
      }),
      fakePortfolioItem({
        portfolioId: portfolio.id,
        assetId: assetTwo.id,
        purchasePrice: 230,
        quantity: 6,
      }),
    ])
  const { getFull } = createCaller(authContext({ db }, user))
  const portfolioDataReturned = await getFull({ id: portfolio.id, group: true })
  expect(portfolioDataReturned).toEqual([
    {
      assetId: assetOne.id,
      assetName: assetOne.name,
      assetPrice: assetOne.price,
      assetType: assetOne.type,
      currencyCode: 'USD',
      purchases: [
        {
          portfolioItemId: portfolioItemOne.id,
          quantity: portfolioItemOne.quantity,
          purchaseDate: portfolioItemOne.purchaseDate,
          purchasePrice: portfolioItemOne.purchasePrice,
        },
      ],
    },
    {
      assetId: assetTwo.id,
      assetName: assetTwo.name,
      assetPrice: assetTwo.price,
      assetType: assetTwo.type,
      currencyCode: 'USD',
      purchases: [
        {
          portfolioItemId: portfolioItemThree.id,
          quantity: portfolioItemThree.quantity,
          purchaseDate: portfolioItemThree.purchaseDate,
          purchasePrice: portfolioItemThree.purchasePrice,
        },
        {
          portfolioItemId: portfolioItemTwo.id,
          quantity: portfolioItemTwo.quantity,
          purchaseDate: portfolioItemTwo.purchaseDate,
          purchasePrice: portfolioItemTwo.purchasePrice,
        },
      ],
    },
  ])
})
