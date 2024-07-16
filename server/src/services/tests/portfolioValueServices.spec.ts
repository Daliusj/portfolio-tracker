import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import { insertAll } from '@tests/utils/records'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
} from '@server/entities/tests/fakes'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import portfolioValueServices from '../portfolioValueServices'
import { fakeUser } from '../../entities/tests/fakes'

const db = await wrapInRollbacks(createTestDatabase())

const fmpWorking = fakeFmp()

const portfolioRepo = portfolioRepository(db)

const services = portfolioValueServices(fmpWorking, portfolioRepo)

describe('getFullPortfolioValue', () => {
  it('should return portfolio total value', async () => {
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
    const value = await services.getFullPortfolioValue(portfolio.id)

    expect(value).toEqual(
      Number(portfolioItemOne.quantity) * Number(assetOne.price) +
        Number(portfolioItemTwo.quantity) * Number(assetTwo.price) +
        Number(portfolioItemThree.quantity) * Number(assetThree.price)
    )
  })
})
