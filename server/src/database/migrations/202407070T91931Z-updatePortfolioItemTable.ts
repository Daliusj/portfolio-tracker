import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`ALTER TABLE portfolio_item ALTER COLUMN purchase_date TYPE timestamptz`.execute(
    db
  )
}

export async function down(db: Kysely<any>) {
  await sql`ALTER TABLE portfolio_item ALTER COLUMN purchase_date TYPE date`.execute(
    db
  )
}
