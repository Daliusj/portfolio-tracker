import { parseAggregatedData } from '../polygonAPi'
import { fakeAggregatedResult, fakeParsedData } from './polygonFakes'

describe('parseAgregatedData', () => {
  it('should parse agregated data', () => {
    const parsedData = parseAggregatedData(fakeAggregatedResult)
    expect(parsedData).toEqual(fakeParsedData)
  })
})
