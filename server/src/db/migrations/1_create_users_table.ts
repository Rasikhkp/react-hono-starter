import { sql } from 'kysely'
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'varchar(36)', col => col.primaryKey().notNull())
    .addColumn('name', 'varchar(100)', col => col.notNull())
    .addColumn('email', 'varchar(50)', col => col.notNull().unique())
    .addColumn('password', 'varchar(255)', col => col.notNull())
    .addColumn('is_active', 'boolean', col => col.defaultTo(true))
    .addColumn('is_email_verified', 'boolean', col => col.defaultTo(false))
    .addColumn('created_at', 'timestamp', col => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updated_at', 'timestamp', col => col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropTable('users')
    .execute()
}
