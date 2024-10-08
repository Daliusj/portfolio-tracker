import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeExchange } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { exchangeRepository } from '../exchangeRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = exchangeRepository(db)

describe('findByShortName', () => {
  it('should find by exchange shortname', async () => {
    const [exchange] = await insertAll(db, 'exchange', fakeExchange({}))
    const exchangeFound = await repository.findByShortName(exchange.shortName)
    expect(exchangeFound).toEqual(exchange)
  })

  it('should find by exchange shortname case insensitive', async () => {
    const [exchange] = await insertAll(
      db,
      'exchange',
      fakeExchange({ name: 'Euronext' })
    )
    const exchangeFound = await repository.findByShortName(
      exchange.shortName.toLowerCase()
    )
    expect(exchangeFound).toEqual(exchange)
  })

  it('should return undifined if no exchange are found', async () => {
    const exchangeFound = await repository.findByShortName('XXX')
    expect(exchangeFound).toBeUndefined()
  })
})

describe('findAll', () => {
  it('should return all exchanges', async () => {
    const exchangesFound = await repository.findAll()
    expect(exchangesFound).toHaveLength(67)
  })
})
