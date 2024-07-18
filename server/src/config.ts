import 'dotenv/config'
import { z } from 'zod'

const { env } = process

if (!env.NODE_ENV) env.NODE_ENV = 'development'

if (!env.DB_INIT_SEED) env.DB_INIT_SEED = 'false'
if (!env.DB_UPDATE) env.DB_UPDATE = 'false'

// force UTC timezone, so it matches the default timezone in production
env.TZ = 'UTC'

const isTest = env.NODE_ENV === 'test'
const isDevTest = env.NODE_ENV === 'development' || isTest

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),

    seed: z.preprocess(coerceBoolean, z.boolean().default(false)),
    update: z.preprocess(coerceBoolean, z.boolean().default(false)),

    auth: z.object({
      tokenKey: z.string().default(() => {
        if (isDevTest) {
          return 'supersecretkey'
        }

        throw new Error('You must provide a TOKEN_KEY in a production env!')
      }),
      expiresIn: z.string().default('7d'),
      passwordCost: z.coerce.number().default(isDevTest ? 6 : 12),
    }),

    database: z.object({
      connectionString: z.string().url(),
    }),

    testDatabase: z.object({
      connectionString: z.string().url(),
    }),

    fmpApiKey: z.string(),
    exchangeRateApiKey: z.string(),
  })
  .readonly()

const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,

  seed: env.DB_INIT_SEED,
  update: env.DB_UPDATE,

  auth: {
    tokenKey: env.TOKEN_KEY,
    expiresIn: env.TOKEN_EXPIRES_IN,
    passwordCost: env.PASSWORD_COST,
  },

  database: {
    connectionString: env.DATABASE_URL,
  },

  testDatabase: {
    connectionString: env.TEST_DATABASE_URL,
  },

  fmpApiKey: env.FMP_API_KEY,
  exchangeRateApiKey: env.EXCHANGE_RATE_API_KEY,
})

export default config

// utility functions
function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
