import type { Database } from '@server/database'
import type { Fmp } from '@server/utils/externalApi/fmpApi'
import historicalDataServices from './historicalDataServices'
import portfolioValueServices from './portfolioValueServices'

export type ServicesFactory = <T>(db: Database, fmpApi: Fmp) => T

const services = { historicalDataServices, portfolioValueServices }

export type ServicesFactories = typeof services
export type Services = {
  [K in keyof ServicesFactories]: ReturnType<ServicesFactories[K]>
}
export type ServicesKeys = keyof Services

export { services }
