import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('asset')
    .addColumn('price', 'numeric', (c) => c.notNull())
    .addColumn('exchange', 'text', (c) => c.notNull())
    .addColumn('exchangeShortName', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema
    .alterTable('asset')
    .dropColumn('price')
    .dropColumn('exchange')
    .dropColumn('exchangeShortName')
    .execute()
}
