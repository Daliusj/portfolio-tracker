import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('asset').dropColumn('name').execute()
  await db.schema
    .alterTable('asset')
    .addColumn('name', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('asset').dropColumn('name').execute()
  await db.schema
    .alterTable('asset')
    .addColumn('name', 'text', (c) => c.notNull().unique())
    .execute()
}
