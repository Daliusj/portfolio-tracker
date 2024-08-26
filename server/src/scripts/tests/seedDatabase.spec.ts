import {
  fakeFmp,
  fakeFmpNotWorking,
} from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { fakeAsset, fakeExchange } from '@server/entities/tests/fakes'
import { describe, it, expect } from 'vitest'
import { seedDatabase } from '../seedDatabase'

const db = await wrapInRollbacks(createTestDatabase())
const fmpApi = fakeFmp()
const fmpApiNotWorking = fakeFmpNotWorking()

const dbSeed = seedDatabase(db, fmpApi)
const dbSeedNotWorking = seedDatabase(db, fmpApiNotWorking)

describe('seed', () => {
  it('should seed the database with stocks, funds and crypto listings', async () => {
    const assets = await dbSeed.seed()
    expect(assets).toEqual({ success: true })
  })

  it('should not seed if there are assets records in the database', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    await insertAll(
      db,
      'asset',
      fakeAsset({ exchangeShortName: exchange.shortName })
    )
    const assets = await dbSeed.seed()
    expect(assets).toEqual({
      success: false,
      message: 'Database is already seeded',
    })
  })

  it('should throw an error if Fmp Api is not working', async () => {
    await expect(dbSeedNotWorking.seed()).rejects.toThrow(/FMP API Error/i)
  })
})
