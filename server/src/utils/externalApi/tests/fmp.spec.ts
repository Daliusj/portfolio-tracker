import axios from 'axios'
import buildFmp from '../fmpApi'

vi.mock('axios')

const fmpApi = buildFmp()

describe('buildFmp', () => {
  it('should fetch time range prices correctly', async () => {
    const mockData = {
      historical: [
        { date: '2023-07-01', close: 103.0 },
        { date: '2023-06-30', close: 102.0 },
      ],
    }

    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockData })

    const result = await fmpApi.fetchTimeRangePrices(
      'AAPL',
      '2023-06-01',
      '2023-07-01'
    )

    expect(result).toEqual([
      { date: '2023-07-01', closePrice: 103.0 },
      { date: '2023-06-30', closePrice: 102.0 },
    ])

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/AAPL'), {
      params: {
        from: '2023-06-01',
        to: '2023-07-01',
        apikey: expect.any(String),
      },
    })
  })

  it('should handle errors in fetchTimeRangePrices', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'))

    await expect(
      fmpApi.fetchTimeRangePrices('AAPL', '2023-06-01', '2023-07-01')
    ).rejects.toThrow('FMP API Error fetching data for AAPL: Network Error')
  })

  it('should fetch day price correctly', async () => {
    const mockData = {
      historical: [{ date: '2023-07-01', close: 103.0 }],
    }

    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockData })

    const result = await fmpApi.fetchDayPrice('AAPL', '2023-07-01')

    expect(result).toEqual([{ date: '2023-07-01', closePrice: 103.0 }])

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/AAPL'), {
      params: {
        from: '2023-07-01',
        to: '2023-07-01',
        apikey: expect.any(String),
      },
    })
  })

  it('should fetch all stocks correctly', async () => {
    const mockData = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        exchange: 'NASDAQ',
        exchangeShortName: 'NSDQ',
        price: 150,
      },
    ]

    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockData })

    const result = await fmpApi.fetchAllStocks()

    expect(result).toEqual([
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        exchangeShortName: 'NSDQ',
        price: 150,
      },
    ])

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/stock/list'),
      {
        params: {
          apikey: expect.any(String),
        },
      }
    )
  })

  it('should fetch all cryptos correctly', async () => {
    const mockCryptoData = [
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin',
        exchangeShortName: 'CCC',
        stockExchange: 'Crypto',
      },
    ]
    const mockHistoricalData = {
      historical: [{ date: '2023-07-01', close: 30000 }],
    }

    vi.spyOn(axios, 'get').mockImplementation((url) => {
      if (url.includes('/symbol/available-cryptocurrencies')) {
        return Promise.resolve({ data: mockCryptoData })
      }
      return Promise.resolve({ data: mockHistoricalData })
    })

    const result = await fmpApi.fetchAllCryptos()

    expect(result).toEqual([
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin',
        type: 'crypto',
        exchange: 'Crypto',
        exchangeShortName: 'CCC',
        price: 30000,
      },
    ])

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/symbol/available-cryptocurrencies'),
      {
        params: {
          apikey: expect.any(String),
        },
      }
    )
  })

  it('should handle errors in fetchCryptosFullListing', async () => {
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'))

    await expect(fmpApi.fetchAllCryptos()).rejects.toThrow(
      'FMP API  Error fetching available cryptocurrencies: Network Error'
    )
  })
})
