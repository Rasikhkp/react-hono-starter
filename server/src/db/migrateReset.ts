import { db } from './database'
import { migrator } from './migrator'

async function migrateReset() {
  let total = 0

  while (true) {
    const { error, results } = await migrator.migrateDown()

    if (results?.length === 0) break

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`)
        total++
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`)
      }
    })

    if (error) {
      console.error('failed to migrate')
      console.error(error)
      process.exit(1)
    }
  }

  console.log(`Successfully rolled back ${total} migration(s)`)
  await db.destroy()
}

migrateReset()
