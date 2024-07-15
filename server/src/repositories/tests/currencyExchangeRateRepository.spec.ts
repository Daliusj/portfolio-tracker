import { createTestDatabase } from '@tests/utils/database'
import { fakeCurrencyExchangeRate } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { currencyExchangeRateRepository } from '../currencyExchangeRatesRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = currencyExchangeRateRepository(db)

describe('create', () => {
  it('should create a new currency exchange rate and return created records', async () => {
    const exchangeRate = fakeCurrencyExchangeRate({})
    const createdExchangeRates = await repository.create(exchangeRate)
    expect(createdExchangeRates).toEqual([
      {
        lastUpdate: expect.any(Date),
        ...exchangeRate,
        exchangeRate: `${exchangeRate.exchangeRate}`,
      },
    ])
  })
  it('should create multiple currency exchange rates and return created records', async () => {
    const exchangeRate = fakeCurrencyExchangeRate({})
    const createdExchangeRates = await repository.create([
      exchangeRate,
      exchangeRate,
    ])
    expect(createdExchangeRates).toEqual([
      {
        lastUpdate: expect.any(Date),
        ...exchangeRate,
        exchangeRate: `${exchangeRate.exchangeRate}`,
      },
      {
        lastUpdate: expect.any(Date),
        ...exchangeRate,
        exchangeRate: `${exchangeRate.exchangeRate}`,
      },
    ])
  })
})

describe('findRate', () => {
  it('should find exchange rate by currency symbol combination', async () => {
    const [currencyRate] = await insertAll(
      db,
      'currencyExchangeRate',
      fakeCurrencyExchangeRate({})
    )
    const ratesFound = await repository.findRate({
      currencyFrom: currencyRate.currencyFrom,
      currencyTo: currencyRate.currencyTo,
    })
    expect(ratesFound).toEqual(currencyRate)
  })

  it('should return undifined if no rates are found', async () => {
    expect(
      await repository.findRate({
        currencyFrom: 'EUR',
        currencyTo: 'USD',
      })
    ).toBeUndefined()
  })
})
