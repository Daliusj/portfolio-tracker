import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {} from '@server/utils/externalApi/tests/fakes'
import { seedDatabase } from '../seedDatabase'

const fmpApi = fakeFmp()
const db = await wrapInRollbacks(createTestDatabase())

const dbSeed = seedDatabase(db, fmpApi)

describe('seed', () => {
  it('should seed the database with stocks, funds and crypto listings', async () => {
    const assets = await dbSeed.seed()
    expect(assets).toEqual({ success: true })
  })
})
