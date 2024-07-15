import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('currency_exchange_rate')
    .addUniqueConstraint('unique_currency_pair', [
      'currency_from',
      'currency_to',
    ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('currency_exchange_rate')
    .dropConstraint('unique_currency_pair')
    .execute()
}
