import buildPolygon from './externalApi/polygonAPi'
import buildAlphaVantage from './externalApi/alphaVantageApi'
import buildExternalApiServices from './externalApiServices'

const polygon = buildPolygon()
const alphaVantage = buildAlphaVantage()
const externalApiServices = buildExternalApiServices(polygon, alphaVantage)

const services = { marketServices: externalApiServices }

// export type ServicesFactories = typeof services

// export type Services = {
//   [K in keyof ServicesFactories]: ReturnType<ServicesFactories[K]>
// }
// export type ServicesKeys = keyof Services

export { services }
