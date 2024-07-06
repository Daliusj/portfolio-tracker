import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_name', 'text', (c) => c.unique().notNull())
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('password', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  await sql`CREATE TYPE investment_type AS ENUM ('stock', 'fund', 'crypto')`.execute(
    db
  )
  await db.schema
    .createTable('asset')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('name', 'text', (c) => c.unique().notNull())
    .addColumn('type', sql`investment_type`, (c) => c.notNull())
    .addColumn('string', 'text', (c) => c.unique().notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  await db.schema
    .createTable('portfolio')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('user_id', 'integer', (c) => c.references('user.id').notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()

  await db.schema
    .createTable('portfolio_item')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('portfolio_id', 'integer', (c) =>
      c.references('portfolio.id').notNull()
    )
    .addColumn('asset_id', 'integer', (c) => c.references('asset.id').notNull())
    .addColumn('quantity', 'numeric', (c) => c.notNull())
    .addColumn('purchase_price', 'numeric', (c) => c.notNull())
    .addColumn('purchase_date', 'date', (c) => c.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('asset').execute()
  await db.schema.dropTable('portfolio').execute()
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('portfolio_item').execute()
  await sql`DROP TYPE investment_type`.execute(db)
}
