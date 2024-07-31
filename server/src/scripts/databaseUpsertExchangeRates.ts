import type { Database } from '../database'
import type { CurrencyPublic } from '../entities/currency'
import { currencyExchangeRateRepository } from '../repositories/currencyExchangeRatesRepository'
import { currencyRepository } from '../repositories/currencyRepository'
import type { ExchangeRatesApi } from '../utils/externalApi/exchangeRatesApi'

export function databaseUpsertExchangeRates(
  db: Database,
  exchangeRatesApi: ExchangeRatesApi
) {
  const currencyRepo = currencyRepository(db)
  const currencyExchangeRatesRepo = currencyExchangeRateRepository(db)

  const generateCurrencyCombinations = (currencies: CurrencyPublic[]) => {
    const baseCurrencies = currencies.filter((currency) => currency.isBase)
    return baseCurrencies.flatMap((sourceCurrency) =>
      currencies.map((targetCurrency) => ({
        from: sourceCurrency.code,
        to: targetCurrency.code,
      }))
    )
  }

  return {
    update: async () => {
      try {
        const currencies = await currencyRepo.findAll()
        const currenciesCombinations = generateCurrencyCombinations(currencies)
        const baseCurrencies = currenciesCombinations.map(
          (currency) => currency.from
        )
        const ratesDataFull = await exchangeRatesApi.fetchRates(baseCurrencies)
        const ratesData = currenciesCombinations.map((pair) => {
          if (pair.from === pair.to) {
            return {
              currencyFrom: pair.from,
              currencyTo: pair.to,
              exchangeRate: 1,
            }
          }

          const allRates = ratesDataFull.find(
            (exchange) => exchange.base === pair.from
          )?.rates

          return {
            currencyFrom: pair.from,
            currencyTo: pair.to,
            exchangeRate: allRates?.[pair.to] || 0,
          }
        })

        const upsertedRates = await currencyExchangeRatesRepo.upsert(ratesData)
        return upsertedRates
      } catch (err) {
        throw new Error(
          `Error updating exchange rates: ${
            err instanceof Error ? err.message : 'An unknown error occurred'
          }`
        )
      }
    },
  }
}

export type DatabaseUpsertExchangeRates = ReturnType<
  typeof databaseUpsertExchangeRates
>
