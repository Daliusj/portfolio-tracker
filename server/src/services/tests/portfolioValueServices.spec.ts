import { insertAll } from '@tests/utils/records'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
} from '@server/entities/tests/fakes'
import portfolioValueServices from '../portfolioValueServices'
import { fakeUser } from '../../entities/tests/fakes'

const db = await wrapInRollbacks(createTestDatabase())
const fmp = {} as any
const services = portfolioValueServices(db, fmp)

describe('getTotalValue', () => {
  it('should return portfolio total value', async () => {
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
    const value = await services.getTotalValue(portfolio.id)

    expect(value).toEqual(
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

  it('should return "0" if portfolio has no items ', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const [portfolio] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: user.id }),
    ])

    const value = await services.getTotalValue(portfolio.id)

    expect(value).toEqual('0.00')
  })
})

describe('getAssetsTypeValue', () => {
  it('should return portfolio total value', async () => {
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
    const [portfolio] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: user.id }),
    ])
    const [, portfolioItemTwo, portfolioItemThree] = await insertAll(
      db,
      'portfolioItem',
      [
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
      ]
    )
    const value = await services.getAssetsTypeValue(portfolio.id, 'stock')

    expect(value).toEqual(
      (
        (Number(portfolioItemTwo.quantity) * Number(assetTwo.price)) /
          Number(rateOne.exchangeRate) +
        (Number(portfolioItemThree.quantity) * Number(assetThree.price)) /
          Number(rateTwo.exchangeRate)
      ).toFixed(2)
    )
  })
  it('should return "0" if portfolio has no assets by specified type ', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const [portfolio] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: user.id }),
    ])
    const value = await services.getAssetsTypeValue(portfolio.id, 'stock')
    expect(value).toEqual('0.00')
  })
})

describe('getAssetValue', () => {
  it('should return asset value', async () => {
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
    const value = await services.getAssetValue(
      portfolio.id,
      portfolioItemTwo.assetId
    )

    expect(value).toEqual(
      (
        (Number(portfolioItemTwo.quantity) * Number(assetTwo.price)) /
        Number(rateOne.exchangeRate)
      ).toFixed(2)
    )
  })
  it('should return undifined if portfolio has no specified assets', async () => {
    const [user] = await insertAll(db, 'user', fakeUser())
    const [portfolio] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: user.id }),
    ])
    const value = await services.getAssetValue(portfolio.id, 99)
    expect(value).toBeUndefined()
  })
})
