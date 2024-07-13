import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('currency')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('name', 'text', (c) => c.unique().notNull())
    .addColumn('code', 'text', (c) => c.unique().notNull())
    .execute()

  await db.schema
    .createTable('exchange')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('name', 'text', (c) => c.unique().notNull())
    .addColumn('short_name', 'text', (c) => c.unique().notNull())
    .addColumn('currency_code', 'text', (c) => c.unique().notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('currency').execute()
  await db.schema.dropTable('exchange').execute()
}
