import config from '@server/config'
import { createDatabase } from '@server/database'

export const createTestDatabase = () =>
  createDatabase(process.env.CI ? config.database : config.testDatabase)
