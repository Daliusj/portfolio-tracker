// starts with the real database configuration
import createApp from '@server/app'
import supertest from 'supertest'
import { fakeFmp } from '@server/utils/externalApi/tests/utils'
import { createTestDatabase } from './utils/database'

const database = createTestDatabase()
const fmp = fakeFmp()
const app = createApp(database, fmp)

afterAll(() => {
  database.destroy()
})

it('can launch the app', async () =>
  supertest(await app)
    .get('/api/health')
    .expect(200, 'OK'))
