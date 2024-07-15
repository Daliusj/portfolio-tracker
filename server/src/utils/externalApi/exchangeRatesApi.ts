import axios from 'axios'
import config from '@server/config'

const BASE_URL = 'https://v6.exchangerate-api.com/v6/'
const LATEST_ENDPOINT = '/latest/'
const apiKey = config.exchangeRateApiKey

export default () => ({
  fetchRates: async (baseCode: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}${apiKey}${LATEST_ENDPOINT}${baseCode}`
      )

      if (response.data.result === 'error') {
        throw new Error(response.data['error-type'])
      }

      return response.data.conversion_rates
    } catch (err) {
      throw new Error(
        `Error fetching currency exchange rates: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  },
})
