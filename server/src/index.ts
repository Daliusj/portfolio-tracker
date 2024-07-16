import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import { seedDatabase } from './scripts/seedDatabase'
import { databaseUpdate } from './scripts/databaseUpdatePrices'

const database = createDatabase(config.database)
const dbUpdate = databaseUpdate(database)
const dbSeed = seedDatabase(database)

const app = createApp(database, dbUpdate, dbSeed)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${config.port}`)
})
