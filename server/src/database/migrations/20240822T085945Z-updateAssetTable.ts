import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`ALTER TABLE asset ADD CONSTRAINT asset_exchange_short_name_fkey FOREIGN KEY (exchange_short_name) REFERENCES exchange(short_name) ON DELETE CASCADE`.execute(
    db
  )
}

export async function down(db: Kysely<any>) {
  await sql`ALTER TABLE asset DROP CONSTRAINT IF EXISTS asset_exchange_short_name_fkey`.execute(
    db
  )
}
