// starts with the real database configuration
import createApp from '@server/app'
import supertest from 'supertest'
import { databaseUpdate } from '@server/scripts/databaseUpdate'
import { seedDatabase } from '@server/scripts/seedDatabase'
import { createTestDatabase } from './utils/database'

const database = createTestDatabase()
const dbUpdate = databaseUpdate(database)
const dbSeed = seedDatabase(database)
const app = createApp(database, dbUpdate, dbSeed)

afterAll(() => {
  database.destroy()
})

it.todo('can launch the app', async () => {
  await supertest(app).get('/api/health').expect(200, 'OK')
})
