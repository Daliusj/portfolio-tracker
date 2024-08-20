/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Database } from '@server/database'
import type { ExchangeRatesApi } from '@server/utils/externalApi/exchangeRatesApi'
import type { Fmp } from '@server/utils/externalApi/fmpApi'
import {
  fakeCurrencyExchangeRatePublic,
  fakePublicAsset,
} from '@server/entities/tests/fakes'
import type { DatabaseUpdatePrices } from '../updateDb/databaseUpdatePrices'
import type { DatabaseUpsertExchangeRates } from '../updateDb/databaseUpsertExchangeRates'
import type { SeedDatabase } from '../seedDatabase'

export const fakeScripts = {
  databaseUpdatePrices: (db: Database, fmpApi: Fmp): DatabaseUpdatePrices => ({
    update: vi.fn(async () => ({ success: true, data: [fakePublicAsset({})] })),
  }),
  databaseUpsertExchangeRates: (
    db: Database,
    exchangeRatesApi: ExchangeRatesApi
  ): DatabaseUpsertExchangeRates => ({
    update: vi.fn(async () => [fakeCurrencyExchangeRatePublic({})]),
  }),
  seedDatabase: (db: Database, fmpApi: Fmp): SeedDatabase => ({
    seed: vi.fn(async () => ({ success: true, data: [fakePublicAsset({})] })),
  }),
}
