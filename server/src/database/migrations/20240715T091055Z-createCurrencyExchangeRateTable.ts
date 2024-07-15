import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('currency_exchange_rate')
    .addColumn('currency_from', 'text', (c) => c.notNull())
    .addColumn('currency_to', 'text', (c) => c.notNull())
    .addColumn('exchange_rate', 'numeric', (c) => c.notNull())
    .addColumn('last_update', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('currency_exchange_rate').execute()
}
