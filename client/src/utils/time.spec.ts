import { localDateToIsoString } from './time'

describe('localDateToIsoString', () => {
  it('should return the correct local date when given a date object in UTC', () => {
    const date = new Date('2024-07-31T21:00:00.000Z')

    const expectedDate = process.env.CI ? '2024-07-31' : '2024-08-01'
    expect(localDateToIsoString(date)).toEqual(expectedDate)
  })
})
