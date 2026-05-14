import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .renameColumn('is_active', 'isActive')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('is_email_verified', 'isEmailVerified')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('created_at', 'createdAt')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('updated_at', 'updatedAt')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('user_id', 'userId')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('token_hash', 'tokenHash')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('is_revoked', 'isRevoked')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('expires_at', 'expiresAt')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('created_at', 'createdAt')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('updated_at', 'updatedAt')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .renameColumn('isActive', 'is_active')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('isEmailVerified', 'is_email_verified')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('createdAt', 'created_at')
    .execute()

  await db.schema
    .alterTable('users')
    .renameColumn('updatedAt', 'updated_at')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('userId', 'user_id')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('tokenHash', 'token_hash')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('isRevoked', 'is_revoked')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('expiresAt', 'expires_at')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('createdAt', 'created_at')
    .execute()

  await db.schema
    .alterTable('refresh_tokens')
    .renameColumn('updatedAt', 'updated_at')
    .execute()
}
