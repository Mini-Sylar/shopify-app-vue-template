import fs from 'fs'
import path, { dirname } from 'path'
import BetterSqlite3 from 'better-sqlite3'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

export const DB_PATH = path.join(process.cwd(), 'src/database/database.sqlite')

export async function initDatabase() {
  try {
    if (!fs.existsSync(dirname(DB_PATH))) {
      fs.mkdirSync(dirname(DB_PATH), { recursive: true })
    }

    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '')
      console.log(`Database created at ${DB_PATH}`)
    }

    const database_dev = new BetterSqlite3(DB_PATH)

    await Promise.all([User.init(database_dev), Webhook.init(database_dev)])
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}
