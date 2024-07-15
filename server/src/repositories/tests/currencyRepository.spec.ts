import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeCurrency } from '@server/entities/tests/fakes'
import { currencyRepository } from '../currencyRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = currencyRepository(db)

describe('findAll', () => {
  it('should find all currencies', async () => {
    const currenciesFound = await repository.findAll()
    expect(currenciesFound[0]).toMatchObject(fakeCurrency({}))
  })
})
