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
  const { update } = createCaller(requestContext({ db }))
  await expect(
    update({
      id: 5,
      currencySymbol: 'USD',
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should update a portfolio', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const { update } = createCaller(authContext({ db }, user))
  const portfolioReturned = await update({
    id: portfolio.id,
    currencySymbol: 'USD',
  })

  expect(portfolioReturned).toMatchObject({
    id: expect.any(Number),
    currencySymbol: 'USD',
    userId: user.id,
  })

  const [portfolioCreated] = await selectAll(db, 'portfolio', (eb) =>
    eb('id', '=', portfolioReturned.id)
  )

  expect(portfolioCreated).toMatchObject(portfolioReturned)
})
