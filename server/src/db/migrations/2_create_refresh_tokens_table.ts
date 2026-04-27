import { sql } from 'kysely'
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('refresh_tokens')
    .addColumn('id', 'varchar(36)', col => col.primaryKey().notNull())
    .addColumn('user_id', 'varchar(36)', col => col.references('users.id').onDelete('cascade').notNull())
    .addColumn('token_hash', 'varchar(64)', col => col.notNull())
    .addColumn('is_revoked', 'boolean', col => col.defaultTo(false))
    .addColumn('expires_at', 'timestamp', col => col.notNull())
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('refresh_tokens')
    .execute()
}
