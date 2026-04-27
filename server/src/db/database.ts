import { createPool } from 'mysql2'
import { Kysely, MysqlDialect, MysqlPool } from 'kysely'
import { DB } from "./schema"
import { env } from '../config/env'

const dialect = new MysqlDialect({
  pool: async () => createPool({
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    port: env.DATABASE_PORT,
  }) as unknown as MysqlPool
})

export const db = new Kysely<DB>({
  dialect,
})
