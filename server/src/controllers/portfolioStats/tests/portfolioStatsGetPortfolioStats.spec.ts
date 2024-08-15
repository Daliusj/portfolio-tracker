import { authContext } from '@tests/utils/context'
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

it('should get portfolio stats', async () => {
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
    fakeAsset({
      type: 'fund',
      price: '100',
      exchangeShortName: 'NYSE',
    }),
    fakeAsset({
      type: 'stock',
      price: '200',
      exchangeShortName: 'NASDAQ',
    }),
    fakeAsset({
      type: 'stock',
      price: '300',
      exchangeShortName: 'Euronext',
    }),
  ])

  const [user] = await insertAll(db, 'user', fakeUser())

  const { getPortfolioStats } = createCaller(authContext({ db }, user))

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

  const totalPurchaseValue = 150 + 500 + 1200

  const totalPortfolioValue =
    (Number(assetOne.price) * 2) / Number(rateOne.exchangeRate) +
    (Number(assetTwo.price) * 4) / Number(rateOne.exchangeRate) +
    (Number(assetThree.price) * 6) / Number(rateTwo.exchangeRate)

  const valueChange = totalPortfolioValue - totalPurchaseValue
  const expectedPercentageChange = (
    (valueChange / totalPurchaseValue) *
    100
  ).toFixed(2)

  const returnedValue = await getPortfolioStats({ id: portfolio.id })

  const expectedStats = {
    portfolioId: portfolio.id,
    valueChange: valueChange.toFixed(2),
    percentageChange: expectedPercentageChange,
  }

  expect(returnedValue).toEqual(expectedStats)
})
