import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.alterTable('asset').renameColumn('string', 'symbol').execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('asset').renameColumn('symbol', 'string').execute()
}
