import { fakeExchangeRatesApi } from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { databaseUpsertExchangeRates } from '../updateDb/databaseUpsertExchangeRates'
import { fakeExchangeRatesApiNotWorking } from '../../utils/externalApi/tests/utils'

const exchangeRatesApi = fakeExchangeRatesApi()
const exchangeRatesApiNotWorking = fakeExchangeRatesApiNotWorking()

const db = await wrapInRollbacks(createTestDatabase())

const dbUpdate = databaseUpsertExchangeRates(db, exchangeRatesApi)
const dbUpdateNotWorking = databaseUpsertExchangeRates(
  db,
  exchangeRatesApiNotWorking
)

describe('upsert', () => {
  it('should upsert database with currency exchange rates', async () => {
    const currencies = await dbUpdate.update()
    const usdEurRate = currencies.find(
      (currency) =>
        currency.currencyFrom === 'USD' && currency.currencyTo === 'EUR'
    )
    const usdGbpRate = currencies.find(
      (currency) =>
        currency.currencyFrom === 'USD' && currency.currencyTo === 'GBP'
    )
    expect(usdEurRate?.exchangeRate).toEqual('0.9')
    expect(usdGbpRate?.exchangeRate).toEqual('0.8')
  })
  it('should throw an error if Exchange Rate Api is not working', async () => {
    await expect(dbUpdateNotWorking.update()).rejects.toThrow(
      /Error fetching currency exchange rates/i
    )
  })
})
