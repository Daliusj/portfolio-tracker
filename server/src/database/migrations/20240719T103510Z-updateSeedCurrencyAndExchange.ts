import type { Kysely } from 'kysely'

const currencies = [
  { name: 'United States Dollar', code: 'USD' },
  { name: 'Euro', code: 'EUR' },
  { name: 'British Pound', code: 'GBP' },
  { name: 'Japanese Yen', code: 'JPY' },
  { name: 'Swiss Franc', code: 'CHF' },
  { name: 'Canadian Dollar', code: 'CAD' },
  { name: 'Australian Dollar', code: 'AUD' },
  { name: 'Chinese Yuan', code: 'CNY' },
  { name: 'Hong Kong Dollar', code: 'HKD' },
  { name: 'Indian Rupee', code: 'INR' },
  { name: 'Singapore Dollar', code: 'SGD' },
  { name: 'Hungarian Forint', code: 'HUF' },
  { name: 'Argentine Peso', code: 'ARS' },
  { name: 'Egyptian Pound', code: 'EGP' },
  { name: 'Danish Krone', code: 'DKK' },
  { name: 'UAE Dirham', code: 'AED' },
  { name: 'Icelandic Króna', code: 'ISK' },
  { name: 'Turkish Lira', code: 'TRY' },
  { name: 'Indonesian Rupiah', code: 'IDR' },
  { name: 'South African Rand', code: 'ZAR' },
  { name: 'Malaysian Ringgit', code: 'MYR' },
  { name: 'South Korean Won', code: 'KRW' },
  { name: 'Kuwaiti Dinar', code: 'KWD' },
  { name: 'Russian Ruble', code: 'RUB' },
  { name: 'Mexican Peso', code: 'MXN' },
  { name: 'New Zealand Dollar', code: 'NZD' },
  { name: 'Norwegian Krone', code: 'NOK' },
  { name: 'Czech Koruna', code: 'CZK' },
  { name: 'Brazilian Real', code: 'BRL' },
  { name: 'Saudi Riyal', code: 'SAR' },
  { name: 'Thai Baht', code: 'THB' },
  { name: 'Chilean Peso', code: 'CLP' },
  { name: 'Swedish Krona', code: 'SEK' },
  { name: 'New Taiwan Dollar', code: 'TWD' },
  { name: 'Israeli Shekel', code: 'ILS' },
  { name: 'Polish Zloty', code: 'PLN' },
]

const exchanges = [
  { name: 'New York Stock Exchange', shortName: 'NYSE', currencyCode: 'USD' },
  { name: 'NASDAQ', shortName: 'NASDAQ', currencyCode: 'USD' },
  { name: 'Frankfurt Stock Exchange', shortName: 'FRA', currencyCode: 'EUR' },
  { name: 'Euronext', shortName: 'Euronext', currencyCode: 'EUR' },
  { name: 'London Stock Exchange', shortName: 'LSE', currencyCode: 'GBP' },
  { name: 'Tokyo Stock Exchange', shortName: 'TSE', currencyCode: 'JPY' },
  { name: 'SIX Swiss Exchange', shortName: 'SIX', currencyCode: 'CHF' },
  { name: 'Toronto Stock Exchange', shortName: 'TSX', currencyCode: 'CAD' },
  {
    name: 'Australian Securities Exchange',
    shortName: 'ASX',
    currencyCode: 'AUD',
  },
  { name: 'Shanghai Stock Exchange', shortName: 'SSE', currencyCode: 'CNY' },
  { name: 'Shenzhen Stock Exchange', shortName: 'SZSE', currencyCode: 'CNY' },
  { name: 'Hong Kong Stock Exchange', shortName: 'HKEX', currencyCode: 'HKD' },
  { name: 'Bombay Stock Exchange', shortName: 'BSE', currencyCode: 'INR' },
  {
    name: 'National Stock Exchange of India',
    shortName: 'NSE',
    currencyCode: 'INR',
  },
  { name: 'Singapore Exchange', shortName: 'SGX', currencyCode: 'SGD' },
  { name: 'American Stock Exchange', shortName: 'AMEX', currencyCode: 'USD' },
  { name: 'Athens Stock Exchange', shortName: 'ATH', currencyCode: 'EUR' },
  { name: 'Berlin Stock Exchange', shortName: 'BER', currencyCode: 'EUR' },
  { name: 'Bolsa de Madrid', shortName: 'BME', currencyCode: 'EUR' },
  { name: 'Brussels Stock Exchange', shortName: 'BRU', currencyCode: 'EUR' },
  { name: 'Budapest Stock Exchange', shortName: 'BUD', currencyCode: 'HUF' },
  {
    name: 'Buenos Aires Stock Exchange',
    shortName: 'BUE',
    currencyCode: 'ARS',
  },
  { name: 'Cairo Stock Exchange', shortName: 'CAI', currencyCode: 'EGP' },
  {
    name: 'Chicago Board Options Exchange',
    shortName: 'CBOE',
    currencyCode: 'USD',
  },
  {
    name: 'Canadian Securities Exchange',
    shortName: 'CNQ',
    currencyCode: 'CAD',
  },
  { name: 'Copenhagen Stock Exchange', shortName: 'CPH', currencyCode: 'DKK' },
  { name: 'Dubai Financial Market', shortName: 'DFM', currencyCode: 'AED' },
  { name: 'ETF Exchange', shortName: 'ETF', currencyCode: 'USD' },
  { name: 'Hamburg Stock Exchange', shortName: 'HAM', currencyCode: 'EUR' },
  { name: 'Helsinki Stock Exchange', shortName: 'HEL', currencyCode: 'EUR' },
  { name: 'Hong Kong Stock Exchange', shortName: 'HKSE', currencyCode: 'HKD' },
  { name: 'Iceland Stock Exchange', shortName: 'ICE', currencyCode: 'ISK' },
  {
    name: 'India International Exchange',
    shortName: 'IOB',
    currencyCode: 'INR',
  },
  { name: 'Istanbul Stock Exchange', shortName: 'IST', currencyCode: 'TRY' },
  { name: 'Jakarta Stock Exchange', shortName: 'JKT', currencyCode: 'IDR' },
  {
    name: 'Johannesburg Stock Exchange',
    shortName: 'JNB',
    currencyCode: 'ZAR',
  },
  { name: 'Japan Exchange Group', shortName: 'JPX', currencyCode: 'JPY' },
  {
    name: 'Kuala Lumpur Stock Exchange',
    shortName: 'KLS',
    currencyCode: 'MYR',
  },
  { name: 'Korean Stock Exchange', shortName: 'KOE', currencyCode: 'KRW' },
  { name: 'Kuwait Stock Exchange', shortName: 'KSC', currencyCode: 'KWD' },
  { name: 'Moscow Exchange', shortName: 'MCX', currencyCode: 'RUB' },
  { name: 'Mexican Stock Exchange', shortName: 'MEX', currencyCode: 'MXN' },
  { name: 'Milan Stock Exchange', shortName: 'MIL', currencyCode: 'EUR' },
  { name: 'NEO Exchange', shortName: 'NEO', currencyCode: 'CAD' },
  { name: 'New Zealand Stock Exchange', shortName: 'NZE', currencyCode: 'NZD' },
  { name: 'Oslo Stock Exchange', shortName: 'OSL', currencyCode: 'NOK' },
  { name: 'OTC Markets Group', shortName: 'OTC', currencyCode: 'USD' },
  { name: 'Pink Sheets', shortName: 'PNK', currencyCode: 'USD' },
  { name: 'Prague Stock Exchange', shortName: 'PRA', currencyCode: 'CZK' },
  { name: 'RIS Exchange', shortName: 'RIS', currencyCode: 'USD' },
  { name: 'São Paulo Stock Exchange', shortName: 'SAO', currencyCode: 'BRL' },
  { name: 'Saudi Stock Exchange', shortName: 'SAU', currencyCode: 'SAR' },
  { name: 'SES Exchange', shortName: 'SES', currencyCode: 'SGD' },
  { name: 'Stock Exchange of Thailand', shortName: 'SET', currencyCode: 'THB' },
  { name: 'Santiago Stock Exchange', shortName: 'SGO', currencyCode: 'CLP' },
  { name: 'Shanghai Stock Exchange', shortName: 'SHH', currencyCode: 'CNY' },
  { name: 'Shenzhen Stock Exchange', shortName: 'SHZ', currencyCode: 'CNY' },
  { name: 'Stockholm Stock Exchange', shortName: 'STO', currencyCode: 'SEK' },
  { name: 'Stuttgart Stock Exchange', shortName: 'STU', currencyCode: 'EUR' },
  { name: 'Taiwan Stock Exchange', shortName: 'TAI', currencyCode: 'TWD' },
  { name: 'Tel Aviv Stock Exchange', shortName: 'TLV', currencyCode: 'ILS' },
  { name: 'TSX Venture Exchange', shortName: 'TSXV', currencyCode: 'CAD' },
  { name: 'Taipei Exchange', shortName: 'TWO', currencyCode: 'TWD' },
  { name: 'Vienna Stock Exchange', shortName: 'VIE', currencyCode: 'EUR' },
  { name: 'Warsaw Stock Exchange', shortName: 'WSE', currencyCode: 'PLN' },
  { name: 'XETRA Exchange', shortName: 'XETRA', currencyCode: 'EUR' },
]

export async function up(db: Kysely<any>) {
  await db.deleteFrom('exchange').execute()
  await db.deleteFrom('currency').execute()

  await db.schema.alterTable('exchange').dropColumn('name').execute()
  await db.schema
    .alterTable('exchange')
    .addColumn('name', 'text', (c) => c.notNull())
    .execute()

  await db.insertInto('currency').values(currencies).execute()
  await db.insertInto('exchange').values(exchanges).execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom('exchange').execute()
  await db.deleteFrom('currency').execute()
}
