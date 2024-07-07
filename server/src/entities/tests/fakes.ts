import type {
  User,
  Asset,
  Portfolio,
  PortfolioItem,
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
    ...overrides,
  }) satisfies Insertable<Portfolio>
