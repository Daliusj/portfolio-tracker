import { authContext, requestContext } from '@tests/utils/context'
import { fakePortfolio, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { get } = createCaller(requestContext({ db }))
  await expect(get()).rejects.toThrow(/unauthenticated/i)
})

it('should get a portfolio', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const { get } = createCaller(authContext({ db }, user))
  const portfolioReturned = await get()

  expect(portfolioReturned).toEqual([portfolio])
})
