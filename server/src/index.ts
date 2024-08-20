import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import buildFmp from './utils/externalApi/fmpApi'

const database = createDatabase(config.database)
const fmp = buildFmp()

const app = await createApp(database, fmp)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${config.port}`)
})
