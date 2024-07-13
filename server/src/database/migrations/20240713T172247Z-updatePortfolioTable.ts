import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('portfolio')
    .addColumn('currency_symbol', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('portfolio')
    .dropColumn('currency_symbol')
    .execute()
}
