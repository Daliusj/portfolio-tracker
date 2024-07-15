// TODO update assetes prices every day 00:00 UTC

import type { Insertable } from 'kysely'
import type { CurrencyExchangeRate, Database } from './database'
import type { CurrencyPublic } from './entities/currency'
import { assetRepository as buildAssetRepository } from './repositories/assetRepository'
import { currencyExchangeRateRepository } from './repositories/currencyExchangeRatesRepository'
import { currencyRepository } from './repositories/currencyRepository'
import buildExchangeRates from './utils/externalApi/exchangeRatesApi'
import buildFmp from './utils/externalApi/fmpApi'

export default async (db: Database) => {
  const exchangeRates = buildExchangeRates()
  const fmpApi = buildFmp()
  const assetRepo = buildAssetRepository(db)
  const currencyRepo = currencyRepository(db)
  const currencyExchangeRatesRepo = currencyExchangeRateRepository(db)

  const updatePrices = async () => {
    const stockPrices = await fmpApi.fetchAllStocksPrices()
    const fundPrices = await fmpApi.fetchAllFundsPrices()
    const cryptoPrices = await fmpApi.fetchAllCryptosPrices()

    await assetRepo.updatePrices([
      ...stockPrices,
      ...fundPrices,
      ...cryptoPrices,
    ])
  }

  const generateCurrencyCombinations = (currencies: CurrencyPublic[]) =>
    currencies.flatMap((sourceCurrency) =>
      currencies
        .map((targetCurrency) => ({
          from: sourceCurrency.code,
          to: targetCurrency.code,
        }))
        .filter((pair) => pair.from !== pair.to)
    )

  const updateCurrencyExchangeRates = async () => {
    const currencies = await currencyRepo.findAll()
    const currenciesCombinations = generateCurrencyCombinations(currencies)
    const baseCurrencies = currenciesCombinations.map(
      (currency) => currency.from
    )
    const ratesDataFull = await exchangeRates.fetchRates(baseCurrencies)
    const ratesData = currenciesCombinations.map((pair) => {
      const allRates = ratesDataFull.find(
        (exchange) => exchange.base === pair.from
      )?.rates
      if (!allRates) throw new Error('Error updating currency conversion rates')

      return {
        currencyFrom: pair.from,
        currencyTo: pair.to,
        exchagneRate: allRates?.[pair.to],
      }
    })

    await currencyExchangeRatesRepo.upsert(
      ratesData as unknown as Insertable<CurrencyExchangeRate>[]
    )
  }

  try {
    await updatePrices()
    await updateCurrencyExchangeRates()
  } catch (err) {
    throw new Error(
      `Error updating assets prices and exchange rates: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}
