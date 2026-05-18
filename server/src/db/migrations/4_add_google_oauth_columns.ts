import { type Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {

  await db.schema
    .alterTable("users")
    .modifyColumn("password", "varchar(255)")
    .execute()

  await db.schema
    .alterTable("users")
    .addColumn("googleSub", "varchar(255)", (col) => col.unique())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("users")
    .dropColumn("googleSub")
    .execute()

  await db.schema
    .alterTable("users")
    .modifyColumn("password", "varchar(255)", (col) => col.notNull())

    .execute()
}
