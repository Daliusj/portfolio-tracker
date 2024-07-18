import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import buildFmp from './utils/externalApi/fmpApi'
import { scripts } from './scripts'
import buildExchangeRatesApi from './utils/externalApi/exchangeRatesApi'

const database = createDatabase(config.database)
const fmp = buildFmp()
const exchangeRatesApi = buildExchangeRatesApi()

const app = await createApp(database, scripts, fmp, exchangeRatesApi)

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${config.port}`)
})
