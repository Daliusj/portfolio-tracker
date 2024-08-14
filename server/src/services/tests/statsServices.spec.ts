import { insertAll } from '@tests/utils/records'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
} from '@server/entities/tests/fakes'
import { fakeUser } from '../../entities/tests/fakes'
import statsServices from '../statsServices'

const db = await wrapInRollbacks(createTestDatabase())
const services = statsServices(db)

describe('getPortfolioStats', () => {
  it('should return correct portfolio stats', async () => {
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
      fakeAsset({ type: 'stock', price: '300', exchangeShortName: 'Euronext' }),
    ])

    const [user] = await insertAll(db, 'user', fakeUser())
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

    const result = await services.getPortfolioStats(portfolio.id)

    const expectedStats = [
      {
        name: assetOne.name,
        totalQuantity: 2,
        avgBuyPrice: Number((150 / 2).toFixed(2)),
        allocation: (
          ((Number(assetOne.price) * 2 * Number(rateOne.exchangeRate)) /
            Number(
              Number(assetOne.price) * 2 * Number(rateOne.exchangeRate) +
                Number(assetTwo.price) * 4 * Number(rateOne.exchangeRate) +
                Number(assetThree.price) * 6 * Number(rateTwo.exchangeRate)
            )) *
          100
        ).toFixed(2),
        price: assetOne.price,
        value: Number(assetOne.price) * 2,
        valueInBaseCurrencie: (
          Number(assetOne.price) *
          2 *
          Number(rateOne.exchangeRate)
        ).toFixed(2),
        valueChange: Number(assetOne.price) * 2 - 150,
        percentageChange: (
          ((Number(assetOne.price) * 2 - 150) / 150) *
          100
        ).toFixed(1),
      },
      {
        name: assetTwo.name,
        totalQuantity: 4,
        avgBuyPrice: 500 / 4,
        allocation: (
          ((Number(assetTwo.price) * 4 * Number(rateOne.exchangeRate)) /
            Number(
              Number(assetOne.price) * 2 * Number(rateOne.exchangeRate) +
                Number(assetTwo.price) * 4 * Number(rateOne.exchangeRate) +
                Number(assetThree.price) * 6 * Number(rateTwo.exchangeRate)
            )) *
          100
        ).toFixed(2),
        price: assetTwo.price,
        value: Number(assetTwo.price) * 4,
        valueInBaseCurrencie: (
          Number(assetTwo.price) *
          4 *
          Number(rateOne.exchangeRate)
        ).toFixed(2),
        valueChange: Number(assetTwo.price) * 4 - 500,
        percentageChange: (
          ((Number(assetTwo.price) * 4 - 500) / 500) *
          100
        ).toFixed(1),
      },
      {
        name: assetThree.name,
        totalQuantity: 6,
        avgBuyPrice: 1200 / 6,
        allocation: (
          ((Number(assetThree.price) * 6 * Number(rateTwo.exchangeRate)) /
            Number(
              Number(assetOne.price) * 2 * Number(rateOne.exchangeRate) +
                Number(assetTwo.price) * 4 * Number(rateOne.exchangeRate) +
                Number(assetThree.price) * 6 * Number(rateTwo.exchangeRate)
            )) *
          100
        ).toFixed(2),
        price: assetThree.price,
        value: Number(assetThree.price) * 6,
        valueInBaseCurrencie: (
          Number(assetThree.price) *
          6 *
          Number(rateTwo.exchangeRate)
        ).toFixed(2),
        valueChange: Number(assetThree.price) * 6 - 1200,
        percentageChange: (
          ((Number(assetThree.price) * 6 - 1200) / 1200) *
          100
        ).toFixed(1),
      },
    ]

    const resolvedResult = await Promise.all(result)
    expect(resolvedResult).toEqual(expectedStats)
  })
})
