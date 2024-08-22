import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  const exchange = [
    { name: 'Euronext', shortName: 'EURONEXT', currencyCode: 'EUR' },
  ]
  await db
    .deleteFrom('exchange')
    .where('shortName', '=', 'Euronext')
    .executeTakeFirst()
  await db.insertInto('exchange').values(exchange).execute()
}

export async function down(db: Kysely<any>) {
  const exchange = [
    { name: 'Euronext', shortName: 'Euronext', currencyCode: 'EUR' },
  ]
  await db
    .deleteFrom('exchange')
    .where('shortName', '=', 'EURONEXT')
    .executeTakeFirst()
  await db.insertInto('exchange').values(exchange).execute()
}
