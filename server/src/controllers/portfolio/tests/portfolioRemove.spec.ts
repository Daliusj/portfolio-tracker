import { authContext, requestContext } from '@tests/utils/context'
import { fakePortfolio, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { remove } = createCaller(requestContext({ db }))
  await expect(remove({ id: 5 })).rejects.toThrow(/unauthenticated/i)
})

it('should throw an error if user is not the portfolio owner', async () => {
  const [userOne, userTwo] = await insertAll(db, 'user', [
    fakeUser(),
    fakeUser(),
  ])
  const [portfolio] = await insertAll(db, 'portfolio', [
    fakePortfolio({ userId: userOne.id }),
  ])
  const { remove } = createCaller(authContext({ db }, userTwo))
  expect(remove({ id: portfolio.id })).rejects.toThrow(/access/i)
})

it('should delete a portfolio', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const { remove } = createCaller(authContext({ db }, user))
  const portfolioReturned = await remove({ id: portfolio.id })
  expect(portfolioReturned).toMatchObject(portfolio)

  const portfoliosInDb = await selectAll(db, 'portfolio')
  expect(portfoliosInDb).toMatchObject([])
})
