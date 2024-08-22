import { createTestDatabase } from '@tests/utils/database'
import {
  fakePortfolioItem,
  fakeUser,
  fakeAsset,
  fakePortfolio,
  fakeExchange,
} from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import { portfolioItemRepository } from '../portfolioItemRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = portfolioItemRepository(db)

describe('create', () => {
  it('should create a new portfolioItem', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const portfolioItem = fakePortfolioItem({
      portfolioId: portfolio.id,
      assetId: asset.id,
    })
    const createdPortfolioItem = await repository.create(portfolioItem)
    expect(createdPortfolioItem).toEqual({
      id: expect.any(Number),
      createdAt: expect.any(Date),
      ...portfolioItem,
      purchasePrice: `${portfolioItem.purchasePrice}`,
      quantity: `${portfolioItem.quantity}`,
      purchaseDate: new Date(`${portfolioItem.purchaseDate}`),
    })
  })
})

describe('findById', () => {
  it('should find portfolioItem by id', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const [portfolioItem] = await insertAll(
      db,
      'portfolioItem',
      fakePortfolioItem({
        assetId: asset.id,
        portfolioId: portfolio.id,
      })
    )
    const portfolioItemFound = await repository.findById(portfolioItem.id)
    expect(portfolioItemFound).toEqual(portfolioItem)
  })

  it('should return undifined if no portfolios are found', async () => {
    const id = 45
    const portfolioItemsFound = await repository.findById(id)
    expect(portfolioItemsFound).toBeUndefined()
  })
})

describe('findByPortfolioId', () => {
  it('should find all portfolioItems by portfolio id', async () => {
    const [userOne, userTwo] = await insertAll(db, 'user', [
      fakeUser({}),
      fakeUser({}),
    ])
    const [portfolioOne, portfolioTwo] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: userOne.id }),
      fakePortfolio({ userId: userTwo.id }),
    ])
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const [portfolioItemOne, portfolioItemTwo] = await insertAll(
      db,
      'portfolioItem',
      [
        fakePortfolioItem({
          assetId: asset.id,
          portfolioId: portfolioOne.id,
        }),
        fakePortfolioItem({
          assetId: asset.id,
          portfolioId: portfolioOne.id,
        }),
        fakePortfolioItem({
          assetId: asset.id,
          portfolioId: portfolioTwo.id,
        }),
      ]
    )
    const portfolioItemsFound = await repository.findByPortfolioId(
      portfolioOne.id
    )
    expect(portfolioItemsFound).toEqual([portfolioItemOne, portfolioItemTwo])
  })

  it('should return an empty array if no portfolios are found', async () => {
    const portfolioId = 45
    const portfolioItemsFound = await repository.findByPortfolioId(portfolioId)
    expect(portfolioItemsFound).toEqual([])
  })
})

describe('update', () => {
  it('should update portfolio item', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const [portfolioItem] = await insertAll(
      db,
      'portfolioItem',
      fakePortfolioItem({ assetId: asset.id, portfolioId: portfolio.id })
    )
    const updatedPortfolioItem = await repository.update(
      {
        assetId: asset.id,
        portfolioId: portfolio.id,
        purchaseDate: '2022-05-14',
        purchasePrice: 999,
        quantity: 999,
      },
      portfolioItem.id
    )
    expect(updatedPortfolioItem).toEqual({
      ...portfolioItem,
      assetId: asset.id,
      portfolioId: portfolio.id,
      purchaseDate: new Date(`2022-05-14 12:00:00`),
      purchasePrice: '999',
      quantity: '999',
    })
  })
})

describe('delete', () => {
  it('should delete portfolio item', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const [asset] = await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const [portfolioItem] = await insertAll(
      db,
      'portfolioItem',
      fakePortfolioItem({ assetId: asset.id, portfolioId: portfolio.id })
    )

    const deletedPortfolioItem = await repository.remove(portfolioItem.id)
    expect(deletedPortfolioItem).toEqual(portfolioItem)
    const portfolioItemsOnDb = await selectAll(db, 'portfolioItem')
    expect(portfolioItemsOnDb).toEqual([])
  })
})
