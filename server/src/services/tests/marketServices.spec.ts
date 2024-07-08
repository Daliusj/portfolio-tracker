import {
  fakeAlphaVantageWorking,
  fakeAlphaVantageNotWorking,
} from '../externalApi/tests/alphaVantageFakes'
import {
  fakePolygonWorking,
  fakePolygonNotWorking,
} from '../externalApi/tests/polygonFakes'
import buildExternalApiServices from '../externalApiServices'

const alphaVantageWorking = fakeAlphaVantageWorking()
const alphaVantageNotWorking = fakeAlphaVantageNotWorking()
const polygonWorking = fakePolygonWorking()
const polygonNotWorking = fakePolygonNotWorking()

const externalApiWorking = buildExternalApiServices(
  polygonWorking,
  alphaVantageWorking
)

const externalApiPolygonNotWorking = buildExternalApiServices(
  polygonNotWorking,
  alphaVantageWorking
)
const externalApiNotWorking = buildExternalApiServices(
  polygonNotWorking,
  alphaVantageNotWorking
)

describe('Alpha Vantage Mock Functions', () => {
  it('fetches stock data for a date range', async () => {
    const data = await alphaVantageMock.fetchTimeRangeStockPrice(
      'AAPL',
      '2023-06-30',
      '2023-07-01'
    )
    expect(data).toEqual([
      { date: '2023-07-01', close: 102.0 },
      { date: '2023-06-30', close: 103.0 },
    ])
  })

  it('fetches crypto data for a date range', async () => {
    const data = await alphaVantageMock.fetchTimeRangeCryptoPrice(
      'BTC',
      '2023-06-30',
      '2023-07-01'
    )
    expect(data).toEqual([
      { date: '2023-07-01', close: 30500.0 },
      { date: '2023-06-30', close: 30000.0 },
    ])
  })

  it('fetches stock data for a single day', async () => {
    const data = await alphaVantageMock.fetchDayStockPrice('AAPL', '2023-07-01')
    expect(data).toEqual({ date: '2023-07-01', close: 102.0 })
  })

  it('fetches crypto data for a single day', async () => {
    const data = await alphaVantageMock.fetchDayCryptoPrice('BTC', '2023-07-01')
    expect(data).toEqual({ date: '2023-07-01', close: 30500.0 })
  })

  it('throws an error when stock data for a specific day is not found', async () => {
    await expect(
      alphaVantageMock.fetchDayStockPrice('AAPL', '2023-07-02')
    ).rejects.toThrow('Data for date 2023-07-02 not found')
  })

  it('throws an error when crypto data for a specific day is not found', async () => {
    await expect(
      alphaVantageMock.fetchDayCryptoPrice('BTC', '2023-07-02')
    ).rejects.toThrow('Data for date 2023-07-02 not found')
  })
})
