import path from 'path'
import { fileURLToPath } from 'node:url'
import buildExchangeRatesApi from '@server/utils/externalApi/exchangeRatesApi'
import { createDatabase } from '../../database'
import buildFmp from '../../utils/externalApi/fmpApi'
import config from '../../config'
import { databaseUpsertExchangeRates } from './databaseUpsertExchangeRates'
import { databaseUpdatePrices } from './databaseUpdatePrices'

const scripts = {
  databaseUpdatePrices,
  databaseUpsertExchangeRates,
}

export type Scripts = typeof scripts

export { scripts }

const pathToThisFile = path.resolve(fileURLToPath(import.meta.url))
const pathPassedToNode = path.resolve(process.argv[1])
const isFileRunDirectly = pathToThisFile.includes(pathPassedToNode)

if (isFileRunDirectly) {
  const db = createDatabase(config.database)
  const fmp = buildFmp()
  const exchangeRatesApi = buildExchangeRatesApi()
  const dbUpdatePrices = databaseUpdatePrices(db, fmp)
  const dbUpdateRates = databaseUpsertExchangeRates(db, exchangeRatesApi)
  try {
    // eslint-disable-next-line no-console
    console.log(
      'Start updating the database with assets prices and currency exchange rates'
    )
    await dbUpdatePrices.update()
    await dbUpdateRates.update()
    // eslint-disable-next-line no-console
    console.log('Update completed')
  } catch (err) {
    throw new Error(
      `Error updating the database: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}
