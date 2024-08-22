import { fakePortfolio, fakeUser } from '@server/entities/tests/fakes'
import { portfolioRepository } from '@server/repositories/portfolioRepository'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { isUserPortfolioOwner } from '../isUserPortfolioOwner'

const db = await wrapInRollbacks(createTestDatabase())
const portfolioRepo = portfolioRepository(db)

describe('isUserPortfolioOwner', () => {
  it('should return true if user is a portfolio owner', async () => {
    const [user] = await insertAll(db, 'user', fakeUser({}))
    const [portfolio] = await insertAll(
      db,
      'portfolio',
      fakePortfolio({ userId: user.id })
    )
    expect(
      await isUserPortfolioOwner(portfolio.id, user.id, portfolioRepo)
    ).toBeTruthy()
  })
  it('should return false if user is not a portfolio owner', async () => {
    const [userOne, userTwo] = await insertAll(db, 'user', [
      fakeUser({}),
      fakeUser({}),
    ])
    const [portfolioOne] = await insertAll(db, 'portfolio', [
      fakePortfolio({ userId: userOne.id }),
      fakePortfolio({ userId: userTwo.id }),
    ])
    expect(
      await isUserPortfolioOwner(portfolioOne.id, userTwo.id, portfolioRepo)
    ).toBeFalsy()
  })
})
