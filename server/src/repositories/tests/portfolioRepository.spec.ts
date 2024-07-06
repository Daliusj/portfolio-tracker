import { createTestDatabase } from '@tests/utils/database'
import { fakePortfolio, fakeUser } from '@server/entities/tests/fakes'
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
