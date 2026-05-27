import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("role_permissions")
    .addColumn("roleId", "varchar(36)", (col) =>
      col.references("roles.id").onDelete("cascade").notNull()
    )
    .addColumn("permissionId", "varchar(36)", (col) =>
      col.references("permissions.id").onDelete("cascade").notNull()
    )
    .addPrimaryKeyConstraint("role_permissions_pk", ["roleId", "permissionId"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("role_permissions").execute();
}
