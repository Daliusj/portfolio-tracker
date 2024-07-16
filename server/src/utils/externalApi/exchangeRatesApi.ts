import axios from 'axios'
import config from '@server/config'

const BASE_URL = 'https://v6.exchangerate-api.com/v6/'
const LATEST_ENDPOINT = '/latest/'
const apiKey = config.exchangeRateApiKey

type CurrencyRates = {
  [currencyCode: string]: number
}
export type CurrencyData = {
  base: string
  rates: CurrencyRates
}

export default function buildExchangeRatesApi() {
  return {
    fetchRates: async (baseCodes: string[]): Promise<CurrencyData[]> => {
      if (!Array.isArray(baseCodes)) {
        throw new Error('baseCodes should be an array')
      }

      try {
        const requests = baseCodes.map((baseCode) =>
          axios.get(`${BASE_URL}${apiKey}${LATEST_ENDPOINT}${baseCode}`)
        )

        const responses = await Promise.all(requests)

        const results = responses.map((response) => {
          if (response.data.result === 'error') {
            throw new Error(response.data['error-type'])
          }
          return {
            base: response.data.base_code,
            rates: response.data.conversion_rates,
          }
        })

        return results as unknown as CurrencyData[]
      } catch (err) {
        throw new Error(
          `Error fetching currency exchange rates: ${
            err instanceof Error ? err.message : 'An unknown error occurred'
          }`
        )
      }
    },
  }
}

export type BuildExchangeRatesApi = typeof buildExchangeRatesApi
export type ExchangeRatesApi = ReturnType<BuildExchangeRatesApi>
