import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`ALTER TABLE portfolio_item DROP CONSTRAINT IF EXISTS portfolio_item_portfolio_id_fkey`.execute(
    db
  )
  await sql`ALTER TABLE portfolio_item ADD CONSTRAINT portfolio_item_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE CASCADE`.execute(
    db
  )
}

export async function down(db: Kysely<any>) {
  await sql`ALTER TABLE portfolio_item DROP CONSTRAINT IF EXISTS portfolio_item_portfolio_id_fkey`.execute(
    db
  )
  await sql`ALTER TABLE portfolio_item ADD CONSTRAINT portfolio_item_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES portfolio(id) ON DELETE NO ACTION`.execute(
    db
  )
}
