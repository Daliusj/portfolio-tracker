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
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { getAssetsStats } = createCaller(requestContext({ db }))
  await expect(
    getAssetsStats({
      id: 12,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should throw an error if user is not the portfolio owner', async () => {
  const [userOne, userTwo] = await insertAll(db, 'user', [
    fakeUser(),
    fakeUser(),
  ])

  const { getAssetsStats } = createCaller(authContext({ db }, userTwo))

  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: userOne.id }),
  ])

  expect(
    getAssetsStats({
      id: portfolio.id,
    })
  ).rejects.toThrow(/access/i)
})

it('should get portfolio assets stats', async () => {
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
    fakeAsset({ type: 'fund', price: '100', exchangeShortName: 'NYSE' }),
    fakeAsset({ type: 'stock', price: '200', exchangeShortName: 'NASDAQ' }),
    fakeAsset({ type: 'stock', price: '300', exchangeShortName: 'EURONEXT' }),
  ])

  const [user] = await insertAll(db, 'user', fakeUser())

  const { getAssetsStats } = createCaller(authContext({ db }, user))

  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: user.id }),
  ])

  await insertAll(db, 'portfolioItem', [
    fakePortfolioItem({
      portfolioId: portfolio.id,
      assetId: assetOne.id,
      purchasePrice: '150',
      quantity: '2',
    }),
    fakePortfolioItem({
      portfolioId: portfolio.id,
      assetId: assetTwo.id,
      purchasePrice: '500',
      quantity: '4',
    }),
    fakePortfolioItem({
      portfolioId: portfolio.id,
      assetId: assetThree.id,
      purchasePrice: '1200',
      quantity: '6',
    }),
  ])

  const returnedValue = await getAssetsStats({ id: portfolio.id })

  const expectedStats = [
    {
      assetId: assetOne.id,
      name: assetOne.name,
      totalQuantity: (2).toFixed(3),
      avgBuyPrice: (150 / 2).toFixed(2),
      allocation: (
        ((Number(assetOne.price) * 2) /
          Number(rateOne.exchangeRate) /
          Number(
            (Number(assetOne.price) * 2) / Number(rateOne.exchangeRate) +
              (Number(assetTwo.price) * 4) / Number(rateOne.exchangeRate) +
              (Number(assetThree.price) * 6) / Number(rateTwo.exchangeRate)
          )) *
        100
      ).toFixed(2),
      price: Number(assetOne.price).toFixed(2),
      value: (Number(assetOne.price) * 2).toFixed(2),
      valueInBaseCurrencie: (
        (Number(assetOne.price) * 2) /
        Number(rateOne.exchangeRate)
      ).toFixed(2),
      valueChange: (Number(assetOne.price) * 2 - 150).toFixed(2),
      percentageChange: (
        ((Number(assetOne.price) * 2 - 150) / 150) *
        100
      ).toFixed(2),
      assetCurrencyCode: 'USD',
    },
    {
      assetId: assetTwo.id,
      name: assetTwo.name,
      totalQuantity: (4).toFixed(3),
      avgBuyPrice: (500 / 4).toFixed(2),
      allocation: (
        ((Number(assetTwo.price) * 4) /
          Number(rateOne.exchangeRate) /
          Number(
            (Number(assetOne.price) * 2) / Number(rateOne.exchangeRate) +
              (Number(assetTwo.price) * 4) / Number(rateOne.exchangeRate) +
              (Number(assetThree.price) * 6) / Number(rateTwo.exchangeRate)
          )) *
        100
      ).toFixed(2),
      price: Number(assetTwo.price).toFixed(2),
      value: (Number(assetTwo.price) * 4).toFixed(2),
      valueInBaseCurrencie: (
        (Number(assetTwo.price) * 4) /
        Number(rateOne.exchangeRate)
      ).toFixed(2),
      valueChange: (Number(assetTwo.price) * 4 - 500).toFixed(2),
      percentageChange: (
        ((Number(assetTwo.price) * 4 - 500) / 500) *
        100
      ).toFixed(2),
      assetCurrencyCode: 'USD',
    },
    {
      assetId: assetThree.id,
      name: assetThree.name,
      totalQuantity: (6).toFixed(3),
      avgBuyPrice: (1200 / 6).toFixed(2),
      allocation: (
        ((Number(assetThree.price) * 6) /
          Number(rateTwo.exchangeRate) /
          Number(
            (Number(assetOne.price) * 2) / Number(rateOne.exchangeRate) +
              (Number(assetTwo.price) * 4) / Number(rateOne.exchangeRate) +
              (Number(assetThree.price) * 6) / Number(rateTwo.exchangeRate)
          )) *
        100
      ).toFixed(2),
      price: Number(assetThree.price).toFixed(2),
      value: (Number(assetThree.price) * 6).toFixed(2),
      valueInBaseCurrencie: (
        (Number(assetThree.price) * 6) /
        Number(rateTwo.exchangeRate)
      ).toFixed(2),
      valueChange: (Number(assetThree.price) * 6 - 1200).toFixed(2),
      percentageChange: (
        ((Number(assetThree.price) * 6 - 1200) / 1200) *
        100
      ).toFixed(2),
      assetCurrencyCode: 'EUR',
    },
  ]

  expect(returnedValue).toEqual(expectedStats)
})
