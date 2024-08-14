import { localDateToIsoString } from './time'

describe('localDateToIsoString', () => {
  it('should return the correct local date when given a date object in UTC', () => {
    const date = new Date('2024-07-31T21:00:00.000Z')

    expect(localDateToIsoString(date)).toEqual('2024-08-01')
  })
})
