import type { Kysely } from 'kysely'

const currencies = [
  { name: 'United States Dollar', code: 'USD', isBase: true },
  { name: 'Euro', code: 'EUR', isBase: true },
  { name: 'British Pound', code: 'GBP', isBase: false },
  { name: 'Japanese Yen', code: 'JPY', isBase: false },
  { name: 'Swiss Franc', code: 'CHF', isBase: false },
  { name: 'Canadian Dollar', code: 'CAD', isBase: false },
  { name: 'Australian Dollar', code: 'AUD', isBase: false },
  { name: 'Chinese Yuan', code: 'CNY', isBase: false },
  { name: 'Hong Kong Dollar', code: 'HKD', isBase: false },
  { name: 'Indian Rupee', code: 'INR', isBase: false },
  { name: 'Singapore Dollar', code: 'SGD', isBase: false },
  { name: 'Hungarian Forint', code: 'HUF', isBase: false },
  { name: 'Argentine Peso', code: 'ARS', isBase: false },
  { name: 'Egyptian Pound', code: 'EGP', isBase: false },
  { name: 'Danish Krone', code: 'DKK', isBase: false },
  { name: 'UAE Dirham', code: 'AED', isBase: false },
  { name: 'Icelandic Króna', code: 'ISK', isBase: false },
  { name: 'Turkish Lira', code: 'TRY', isBase: false },
  { name: 'Indonesian Rupiah', code: 'IDR', isBase: false },
  { name: 'South African Rand', code: 'ZAR', isBase: false },
  { name: 'Malaysian Ringgit', code: 'MYR', isBase: false },
  { name: 'South Korean Won', code: 'KRW', isBase: false },
  { name: 'Kuwaiti Dinar', code: 'KWD', isBase: false },
  { name: 'Russian Ruble', code: 'RUB', isBase: false },
  { name: 'Mexican Peso', code: 'MXN', isBase: false },
  { name: 'New Zealand Dollar', code: 'NZD', isBase: false },
  { name: 'Norwegian Krone', code: 'NOK', isBase: false },
  { name: 'Czech Koruna', code: 'CZK', isBase: false },
  { name: 'Brazilian Real', code: 'BRL', isBase: false },
  { name: 'Saudi Riyal', code: 'SAR', isBase: false },
  { name: 'Thai Baht', code: 'THB', isBase: false },
  { name: 'Chilean Peso', code: 'CLP', isBase: false },
  { name: 'Swedish Krona', code: 'SEK', isBase: false },
  { name: 'New Taiwan Dollar', code: 'TWD', isBase: false },
  { name: 'Israeli Shekel', code: 'ILS', isBase: false },
  { name: 'Polish Zloty', code: 'PLN', isBase: false },
]

export async function up(db: Kysely<any>) {
  await db.deleteFrom('currency').execute()

  await db.schema
    .alterTable('currency')
    .addColumn('isBase', 'boolean', (c) => c.notNull())
    .execute()

  await db.insertInto('currency').values(currencies).execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom('currency').execute()
}
