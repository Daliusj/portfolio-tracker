/* eslint-disable no-console */
import path from 'path'
import { fileURLToPath } from 'node:url'
import { chunk, uniqBy } from 'lodash-es'
import { exchangeRepository } from '@server/repositories/exchangeRepository'
import type { Fmp } from '../utils/externalApi/fmpApi'
import { assetRepository } from '../repositories/assetRepository'
import { createDatabase, type Database } from '../database'
import buildFmp from '../utils/externalApi/fmpApi'
import config from '../config'

export function seedDatabase(db: Database, fmpApi: Fmp) {
  const assetRepo = assetRepository(db)
  const exchangeRepo = exchangeRepository(db)

  const seed = async () => {
    try {
      if (await assetRepo.isAssetsEmpty()) {
        const stocks = await fmpApi.fetchAllStocks()
        const cryptos = await fmpApi.fetchAllCryptos()
        const funds = await fmpApi.fetchAllFunds()

        const validExchanges = await exchangeRepo.findAll()
        const validExchangeShortNames = validExchanges.map(
          (exchange) => exchange.shortName
        )

        const filterAssets = (assets: any[]) =>
          assets.filter(
            (asset) =>
              asset.name &&
              asset.name.trim() !== '' &&
              asset.exchange &&
              asset.exchange.trim() !== '' &&
              asset.price &&
              validExchangeShortNames.includes(asset.exchangeShortName)
          )

        const filteredAssets = filterAssets(
          uniqBy([...cryptos, ...funds, ...stocks], 'symbol')
        )

        const assetsChunked = chunk(filteredAssets, 100)

        const createChunks = async (chunks: any[]) => {
          await Promise.all(
            chunks.map(async (chunkData, index) => {
              try {
                await assetRepo.create(chunkData)
              } catch (error) {
                console.error(`Error processing chunk ${index + 1}:`, error)
                throw error
              }
            })
          )
        }

        await Promise.all([createChunks(assetsChunked)])
        return { success: true }
      }
    } catch (err) {
      throw new Error(
        `Error seeding the database: ${
          err instanceof Error ? err.message : 'An unknown error occurred'
        }`
      )
    }
    return { success: false, message: 'Database is already seeded' }
  }
  return { seed }
}

export type SeedDatabase = ReturnType<typeof seedDatabase>

export async function runSeedScript() {
  const db = createDatabase(config.database)
  const fmp = buildFmp()
  const dbSeed = seedDatabase(db, fmp)
  try {
    console.log('Start seeding the database with assets listings')
    await dbSeed.seed()
    console.log('Seeding completed')
  } catch (err) {
    throw new Error(
      `Error seeding the database: ${
        err instanceof Error ? err.message : 'An unknown error occurred'
      }`
    )
  }
}

const pathToThisFile = path.resolve(fileURLToPath(import.meta.url))
const pathPassedToNode = path.resolve(process.argv[1])
const isFileRunDirectly = pathToThisFile.includes(pathPassedToNode)

if (isFileRunDirectly) {
  runSeedScript()
}
