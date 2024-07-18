import type { Database } from '@server/database'
import { userRepository } from './userRepository'
import { assetRepository } from './assetRepository'
import { portfolioRepository } from './portfolioRepository'
import { portfolioItemRepository } from './portfolioItemRepository'

export type RepositoryFactory = <T>(db: Database) => T

const repositories = {
  assetRepository,
  userRepository,
  portfolioRepository,
  portfolioItemRepository,
}

export type RepositoriesFactories = typeof repositories
export type Repositories = {
  [K in keyof RepositoriesFactories]: ReturnType<RepositoriesFactories[K]>
}
export type RepositoriesKeys = keyof Repositories

export { repositories }
