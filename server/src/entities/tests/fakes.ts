import type {
  User,
  Asset,
  Portfolio,
  PortfolioItem,
  CurrencyExchangeRate,
  Currency,
} from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import type { AuthUser } from '../user'

const randomId = () =>
  random.integer({
    min: 1,
    max: 1000000,
  })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) =>
  ({
    email: random.email(),
    userName: random.first(),
    password: 'Password.123!',
    ...overrides,
  }) satisfies Insertable<User>

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: randomId(),
  email: random.email(),
  ...overrides,
})

/**
 * Generates a fake asset with some default test data.
 * @param overrides userId and any properties that should be different from default fake data.
 */
export const fakeAsset = <T extends Partial<Insertable<Asset>>>(overrides: T) =>
  ({
    name: random.string(),
    type: 'stock',
    symbol: random.string(),
    price: random.floating({ min: 0, max: 100 }),
    exchange: random.string(),
    exchangeShortName: random.string(),

    ...overrides,
  }) satisfies Insertable<Asset>

/**
 * Generates a fake portfolioItem with some default test data.
 * @param overrides articleId and any properties that should be different from default fake data.
 */
export const fakePortfolioItem = <T extends Partial<Insertable<PortfolioItem>>>(
  overrides: T
) =>
  ({
    portfolioId: randomId(),
    assetId: randomId(),
    quantity: random.floating({ min: 0.1, max: 100, fixed: 3 }),
    purchasePrice: random.floating({ min: 1, max: 1000, fixed: 2 }),
    purchaseDate: new Date(`2023-10-12 12:00:00`),
    ...overrides,
  }) satisfies Insertable<PortfolioItem>

/**
 * Generates a fake portfolio with some default test data.
 * @param overrides articleId and any properties that should be different from default fake data.
 */
export const fakePortfolio = <T extends Partial<Insertable<Portfolio>>>(
  overrides: T
) =>
  ({
    userId: randomId(),
    currencySymbol: 'Eur',
    ...overrides,
  }) satisfies Insertable<Portfolio>

/**
 * Generates a fake currencyExchangeRate with some default test data.
 * @param overrides  properties that should be different from default fake data.
 */
export const fakeCurrencyExchangeRate = <
  T extends Partial<Insertable<CurrencyExchangeRate>>,
>(
  overrides: T
) =>
  ({
    currencyFrom: random.string({ length: 3 }),
    currencyTo: random.string({ length: 3 }),
    exchangeRate: random.floating({ min: 0.5, max: 5, fixed: 2 }),
    ...overrides,
  }) satisfies Insertable<CurrencyExchangeRate>

/**
 * Generates a fake currency with some default test data.
 * @param overrides  properties that should be different from default fake data.
 */
export const fakeCurrency = <T extends Partial<Insertable<Currency>>>(
  overrides: T
) =>
  ({
    name: 'United States Dollar',
    code: 'USD',
    ...overrides,
  }) satisfies Insertable<Currency>
