import { authContext, requestContext } from '@tests/utils/context'
import {
  fakeAsset,
  fakePortfolio,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import portfolioItemRouter from '..'

const createCaller = createCallerFactory(portfolioItemRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should throw an error if user is not authenticated', async () => {
  const { create } = createCaller(requestContext({ db }))
  await expect(
    create({
      quantity: 1,
      assetId: 12,
      portfolioId: 34,
      purchaseDate: '2022-05-14',
      purchasePrice: 123.0,
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('should create a persisted portfolio item', async () => {
  const [user] = await insertAll(db, 'user', fakeUser())
  const [portfolio] = await insertAll(
    db,
    'portfolio',
    fakePortfolio({ userId: user.id })
  )
  const [asset] = await insertAll(db, 'asset', fakeAsset({}))
  const { create } = createCaller(authContext({ db }, user))
  const portfolioItemReturned = await create({
    quantity: 1,
    assetId: asset.id,
    portfolioId: portfolio.id,
    purchaseDate: '2022-05-14',
    purchasePrice: 123.0,
  })

  expect(portfolioItemReturned).toMatchObject({
    id: expect.any(Number),
    quantity: '1',
    assetId: asset.id,
    portfolioId: portfolio.id,
    purchaseDate: new Date(`2022-05-14`),
    purchasePrice: '123',
  })

  const [portfolioItemCreated] = await selectAll(db, 'portfolioItem', (eb) =>
    eb('id', '=', portfolioItemReturned.id)
  )

  expect(portfolioItemCreated).toMatchObject(portfolioItemReturned)
})
