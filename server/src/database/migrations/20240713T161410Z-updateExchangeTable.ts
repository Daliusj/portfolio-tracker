import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('exchange').dropColumn('currency_code').execute()

  await db.schema
    .alterTable('exchange')
    .addColumn('currency_code', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('exchange').dropColumn('currency_code').execute()

  await db.schema
    .alterTable('exchange')
    .addColumn('currency_code', 'text', (c) => c.unique().notNull())
    .execute()
}
