// starts with the real database configuration
import createApp from '@server/app'
import supertest from 'supertest'
import {
  fakeExchangeRatesApi,
  fakeFmp,
} from '@server/utils/externalApi/tests/utils'
import { fakeScripts } from '@server/scripts/tests/utils'
import { createTestDatabase } from './utils/database'

const database = createTestDatabase()
const fmp = fakeFmp()
const exchangeRatesApi = fakeExchangeRatesApi()
const app = createApp(database, fakeScripts, fmp, exchangeRatesApi)

afterAll(() => {
  database.destroy()
})

it('can launch the app', async () =>
  supertest(await app)
    .get('/api/health')
    .expect(200, 'OK'))
