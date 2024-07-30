import type { Kysely } from 'kysely'

const exchanges = [{ name: 'CCC', shortName: 'CRYPTO', currencyCode: 'USD' }]

export async function up(db: Kysely<any>) {
  await db.insertInto('exchange').values(exchanges).execute()
}
