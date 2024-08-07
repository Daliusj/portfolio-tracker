import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type InvestmentType = 'crypto' | 'fund' | 'stock'

export type Numeric = ColumnType<string, number | string, number | string>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Asset {
  createdAt: Generated<Timestamp>
  exchange: string
  exchangeShortName: string
  id: Generated<number>
  name: string
  price: Numeric
  symbol: string
  type: InvestmentType
}

export interface Currency {
  code: string
  id: Generated<number>
  isBase: boolean
  name: string
}

export interface CurrencyExchangeRate {
  currencyFrom: string
  currencyTo: string
  exchangeRate: Numeric
  lastUpdate: Generated<Timestamp>
}

export interface Exchange {
  currencyCode: string
  id: Generated<number>
  name: string
  shortName: string
}

export interface Portfolio {
  createdAt: Generated<Timestamp>
  currencySymbol: string
  id: Generated<number>
  name: string
  userId: number
}

export interface PortfolioItem {
  assetId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  portfolioId: number
  purchaseDate: Timestamp
  purchasePrice: Numeric
  quantity: Numeric
}

export interface User {
  createdAt: Generated<Timestamp>
  email: string
  id: Generated<number>
  password: string
  userName: string
}

export interface DB {
  asset: Asset
  currency: Currency
  currencyExchangeRate: CurrencyExchangeRate
  exchange: Exchange
  portfolio: Portfolio
  portfolioItem: PortfolioItem
  user: User
}
