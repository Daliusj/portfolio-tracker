import { createTestDatabase } from '@tests/utils/database'
import { fakeCurrencyExchangeRate } from '@server/entities/tests/fakes'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'
import { currencyExchangeRateRepository } from '../currencyExchangeRatesRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = currencyExchangeRateRepository(db)

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

describe('upsert', () => {
  it('should insert a new currency exchange rate if it does not exist', async () => {
    const exchangeRate = fakeCurrencyExchangeRate({})
    const upsertedExchangeRates = await repository.upsert([exchangeRate])
    expect(upsertedExchangeRates.length).toBe(1)
    expect(upsertedExchangeRates[0]).toEqual({
      lastUpdate: expect.any(Date),
      ...exchangeRate,
      exchangeRate: `${exchangeRate.exchangeRate}`,
    })
  })

  it('should update an existing currency exchange rate if it already exists', async () => {
    const exchangeRate = fakeCurrencyExchangeRate({})
    const [insertedRate] = await insertAll(
      db,
      'currencyExchangeRate',
      exchangeRate
    )
    const updatedExchangeRate = { ...insertedRate, exchangeRate: '1.2345' } // Simulate update
    const upsertedExchangeRates = await repository.upsert([updatedExchangeRate])
    expect(upsertedExchangeRates.length).toBe(1)
    expect(upsertedExchangeRates[0]).toEqual({
      ...insertedRate,
      exchangeRate: '1.2345',
    })
  })
})
