import { authContext } from '@tests/utils/context'
import { fakeExchange } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import exchangeRouter from '..'

const createCaller = createCallerFactory(exchangeRouter)
const db = await wrapInRollbacks(createTestDatabase())

it('should get exchange by short name', async () => {
  const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
  const { getByShortName } = createCaller(authContext({ db }))
  const exchangeReturned = await getByShortName({
    shortName: exchange.shortName,
  })

  expect(exchangeReturned).toEqual(exchange)
})
