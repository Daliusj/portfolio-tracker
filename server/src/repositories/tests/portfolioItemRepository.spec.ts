import { createTestDatabase } from '@tests/utils/database'
import {
  fakePortfolioItem,
  fakeUser,
  fakeAsset,
  fakePortfolio,
} from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
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
    const [asset] = await insertAll(db, 'asset', fakeAsset({}))
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
    const [asset] = await insertAll(db, 'asset', fakeAsset({}))
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
    const [asset] = await insertAll(db, 'asset', fakeAsset({}))
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
