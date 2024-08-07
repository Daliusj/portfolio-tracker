import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeCryptosList,
  fakeStocksList,
} from '@server/utils/externalApi/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { databaseUpdatePrices } from '../databaseUpdatePrices'
import { fakeFundsList } from '../../utils/externalApi/tests/fakes'

const fmpApi = fakeFmp()
const db = await wrapInRollbacks(createTestDatabase())

const dbUpdate = databaseUpdatePrices(db, fmpApi)

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
})
