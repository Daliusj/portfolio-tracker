import {
  fakeFmp,
  fakeFmpNotWorking,
} from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeCryptosList,
  fakeStocksList,
} from '@server/utils/externalApi/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { databaseUpdatePrices } from '../updateDb/databaseUpdatePrices'
import { fakeFundsList } from '../../utils/externalApi/tests/fakes'

const fmpApi = fakeFmp()
const fmpApiNotWorking = fakeFmpNotWorking()
const db = await wrapInRollbacks(createTestDatabase())

const dbUpdate = databaseUpdatePrices(db, fmpApi)
const dbUpdateNotWorking = databaseUpdatePrices(db, fmpApiNotWorking)

describe('update', () => {
  it('should update the database with stocks, funds and crypto prices', async () => {
    await insertAll(db, 'asset', [
      ...fakeStocksList,
      ...fakeFundsList,
      ...fakeCryptosList,
    ])
    const assets = await dbUpdate.update()
    expect(assets).toEqual({ success: true })
  })
  it('should throw an error if Fmp Api is not working', async () => {
    await expect(dbUpdateNotWorking.update()).rejects.toThrow(/FMP API Error/i)
  })
})
