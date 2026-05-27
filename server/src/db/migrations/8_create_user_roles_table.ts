import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user_roles")
    .addColumn("userId", "varchar(36)", (col) =>
      col.references("users.id").onDelete("cascade").notNull()
    )
    .addColumn("roleId", "varchar(36)", (col) =>
      col.references("roles.id").onDelete("cascade").notNull()
    )
    .addPrimaryKeyConstraint("user_roles_pk", ["userId", "roleId"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_roles").execute();
}
