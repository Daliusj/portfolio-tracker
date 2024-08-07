import { createTestDatabase } from '@tests/utils/database'
import {
  fakeAsset,
  fakePortfolio,
  fakePortfolioItem,
  fakeUser,
} from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
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

describe('update', () => {
  it('should update portfolio currency symbol and name', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const updatedPortfolio = await repository.update(
      portfolio.id,
      user.id,
      'USD',
      'MyPortfolio'
    )
    expect(updatedPortfolio).toEqual({
      ...portfolio,
      currencySymbol: 'USD',
      name: 'MyPortfolio',
    })
  })
})

describe('delete', () => {
  it('should delete portfolio', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const deletedPortfolio = await repository.remove(portfolio.id, user.id)
    expect(deletedPortfolio).toEqual(portfolio)
    const portfoliosOnDb = await selectAll(db, 'portfolio')
    expect(portfoliosOnDb).toEqual([])
  })

  it.todo(
    'should delete portfolio and referenced portfolio items',
    async () => {
      const [user] = await insertAll(db, 'user', fakeUser({}))
      const [portfolio] = await insertAll(
        db,
        'portfolio',
        fakePortfolio({ userId: user.id })
      )
      await insertAll(
        db,
        'portfolioItem',
        fakePortfolioItem({ portfolioId: portfolio.id })
      )
      const deletedPortfolio = await repository.remove(portfolio.id, user.id)

      expect(deletedPortfolio).toEqual(portfolio)

      const portfoliosOnDb = await selectAll(db, 'portfolio')
      expect(portfoliosOnDb).toEqual([])

      const portfolioItemsOnDb = await selectAll(db, 'portfolioItem')
      expect(portfolioItemsOnDb).toEqual([])
    }
  )
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

describe('findById', () => {
  it('should find portfolio by id', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const portfolioFound = await repository.findById(portfolio.id)
    expect(portfolioFound).toEqual(portfolio)
  })

  it('should return undifined if no portfolios are found', async () => {
    const portfoliosFound = await repository.findById(56)
    expect(portfoliosFound).toBeUndefined()
  })
})

describe('findFull', () => {
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
    const portfolioData = await repository.findFull(portfolio.id)
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

describe('findFullByAssetsType', () => {
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
    const portfolioData = await repository.findFullByAssetsType(
      portfolio.id,
      'stock'
    )
    expect(portfolioData).toEqual([
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

describe('findFullByAssetId', () => {
  it('should return full portfolio data from joined tables by portfolio id', async () => {
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
    const portfolioData = await repository.findFullByAssetId(
      portfolio.id,
      portfolioItemTwo.assetId
    )
    expect(portfolioData).toEqual([
      {
        id: assetTwo.id,
        name: assetTwo.name,
        price: assetTwo.price,
        type: assetTwo.type,
        quantity: portfolioItemTwo.quantity,
        currencyCode: 'USD',
      },
    ])
  })
})
