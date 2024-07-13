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
  { name: 'Bitcoin', code: 'BTC' },
  { name: 'Ethereum', code: 'ETH' },
  { name: 'Tether', code: 'USDT' },
  { name: 'Binance Coin', code: 'BNB' },
  { name: 'USD Coin', code: 'USDC' },
  { name: 'Ripple', code: 'XRP' },
  { name: 'Cardano', code: 'ADA' },
  { name: 'Solana', code: 'SOL' },
  { name: 'Polkadot', code: 'DOT' },
  { name: 'Dogecoin', code: 'DOGE' },
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
  { name: 'Binance', shortName: 'Binance', currencyCode: 'BTC' },
  { name: 'Coinbase', shortName: 'Coinbase', currencyCode: 'BTC' },
  { name: 'Kraken', shortName: 'Kraken', currencyCode: 'BTC' },
  { name: 'Bitfinex', shortName: 'Bitfinex', currencyCode: 'USDT' },
  { name: 'Huobi', shortName: 'Huobi', currencyCode: 'USDT' },
  { name: 'Bitstamp', shortName: 'Bitstamp', currencyCode: 'XRP' },
  { name: 'Robinhood', shortName: 'Robinhood', currencyCode: 'DOGE' },
]

export async function up(db: Kysely<any>) {
  await db.insertInto('currency').values(currencies).execute()
  await db.insertInto('exchange').values(exchanges).execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom('exchange').execute()
  await db.deleteFrom('currency').execute()
}
