import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
  fakeUser,
} from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { portfolioRepository } from '../portfolioRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = portfolioRepository(db)

describe('create', () => {
  it('should create a new portfolio', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const portfolio = fakePortfolio({ userId: user.id })
    const createdPortfolio = await repository.create(portfolio)
    expect(createdPortfolio).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Date),
      ...portfolio,
    })
  })
})

describe('findByUserId', () => {
  it('should find portfolio by user id', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const portfolioFound = await repository.findByUserId(user.id)
    expect(portfolioFound).toEqual([portfolio])
  })

  it('should return an empty array if no portfolios are found', async () => {
    const userId = 456
    const portfoliosFound = await repository.findByUserId(userId)
    expect(portfoliosFound).toEqual([])
  })
})

describe('findFullPortfolioByPortfolioId', () => {
  it('should return full portfolio data from joined tables by portfolio id', async () => {
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
    const portfolioData = await repository.findFullPortfolio(portfolio.id)
    expect(portfolioData).toEqual([
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
})
