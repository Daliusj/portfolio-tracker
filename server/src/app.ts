import express from 'express'
import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express'
import cors from 'cors'
import { renderTrpcPanel } from 'trpc-panel'
import type { Database } from './database'
import { appRouter } from './controllers'
import type { Context } from './trpc'
import config from './config'
import type { Fmp } from './utils/externalApi/fmpApi'
import type { Scripts } from './scripts'
import type { ExchangeRatesApi } from './utils/externalApi/exchangeRatesApi'

export default async function createApp(
  db: Database,
  scripts: Scripts,
  fmp: Fmp,
  exchangeRatesApi: ExchangeRatesApi
) {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/api/health', (_, res) => {
    res.status(200).send('OK')
  })

  app.use(
    '/api/v1/trpc',
    createExpressMiddleware({
      createContext: ({ req, res }: CreateExpressContextOptions): Context => ({
        db,
        fmp,
        req,
        res,
      }),
      router: appRouter,
    })
  )

  if (config.env === 'development') {
    app.use('/api/v1/trpc-panel', (_, res) =>
      res.send(
        renderTrpcPanel(appRouter, {
          url: `http://localhost:${config.port}/api/v1/trpc`,
          transformer: 'superjson',
        })
      )
    )
  }

  if (config.seed) {
    const dbSeed = scripts.seedDatabase(db, fmp)
    try {
      // eslint-disable-next-line no-console
      console.log('Start seeding the database with assets listings')
      await dbSeed.seed()
      // eslint-disable-next-line no-console
      console.log('Seeding completed')
    } catch (err) {
      throw new Error(
        `Error seeding the database: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }
  if (config.update) {
    // const dbUpdatePrices = scripts.databaseUpdatePrices(db, fmp)
    const dbUpdateRates = scripts.databaseUpsertExchangeRates(
      db,
      exchangeRatesApi
    )
    try {
      // eslint-disable-next-line no-console
      console.log(
        'Start updating the database with assets prices and currency exchange rates'
      )
      // await dbUpdatePrices.update()
      await dbUpdateRates.update()
      // eslint-disable-next-line no-console
      console.log('Updating completed')
    } catch (err) {
      throw new Error(
        `Error updating the database: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
  }

  return app
}
