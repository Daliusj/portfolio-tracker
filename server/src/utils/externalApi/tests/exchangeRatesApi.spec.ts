import axios from 'axios'
import buildExchangeRatesApi, { type CurrencyData } from '../exchangeRatesApi'

vi.mock('axios')
const exchangeRatesApi = buildExchangeRatesApi()

describe('buildExchangeRatesApi', () => {
  it('should fetch exchange rates for multiple base currencies', async () => {
    const mockData = {
      base_code: 'USD',
      conversion_rates: {
        EUR: 0.85,
        GBP: 0.75,
      },
      result: 'success',
    }

    const axiosGetMock = vi
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: mockData })

    const baseCodes = ['USD', 'EUR']
    const results = await exchangeRatesApi.fetchRates(baseCodes)

    expect(axiosGetMock).toHaveBeenCalledTimes(baseCodes.length)
    expect(axiosGetMock).toHaveBeenCalledWith(expect.stringContaining('USD'))
    expect(axiosGetMock).toHaveBeenCalledWith(expect.stringContaining('EUR'))

    const expectedResults: CurrencyData[] = [
      {
        base: 'USD',
        rates: {
          EUR: 0.85,
          GBP: 0.75,
        },
      },
    ]

    expect(results).toEqual(expect.arrayContaining(expectedResults))
  })

  it('should throw an error when baseCodes is not an array', async () => {
    await expect(exchangeRatesApi.fetchRates('USD' as any)).rejects.toThrow(
      'baseCodes should be an array'
    )
  })

  it('should throw an error if the API response is an error', async () => {
    const errorResponse = {
      data: {
        result: 'error',
        'error-type': 'unsupported-code',
      },
    }

    vi.spyOn(axios, 'get').mockResolvedValue(errorResponse)

    await expect(exchangeRatesApi.fetchRates(['INVALID'])).rejects.toThrow(
      'unsupported-code'
    )
  })

  it('should throw an error if the API request fails', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'))

    await expect(exchangeRatesApi.fetchRates(['USD'])).rejects.toThrow(
      'Error fetching currency exchange rates: Network Error'
    )
  })
})
