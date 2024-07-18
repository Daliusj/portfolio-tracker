import { databaseUpdatePrices } from './databaseUpdatePrices'
import { databaseUpsertExchangeRates } from './databaseUpsertExchangeRates'
import { seedDatabase } from './seedDatabase'

const scripts = {
  databaseUpdatePrices,
  databaseUpsertExchangeRates,
  seedDatabase,
}

export type Scripts = typeof scripts

export { scripts }
