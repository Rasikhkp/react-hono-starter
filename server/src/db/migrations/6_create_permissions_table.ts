import { sql } from "kysely";
import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("permissions")
    .addColumn('id', 'varchar(36)', col => col.primaryKey().notNull())
    .addColumn("name", "varchar(100)", (col) => col.notNull().unique())
    .addColumn("description", "varchar(255)")
    .addColumn("resource", "varchar(50)", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("permissions").execute();
}
