import { authContext, requestContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import portfolioRouter from '..'

const createCaller = createCallerFactory(portfolioRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { create } = createCaller(requestContext({ db }))
  await expect(
    create({
      currencySymbol: 'USD',
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a persisted portfolio', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const { create } = createCaller(authContext({ db }, user))
  const portfolioReturned = await create({
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
