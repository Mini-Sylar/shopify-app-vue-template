import fs from 'fs'
import path from 'path'
import BetterSqlite from 'better-sqlite3'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

export const DB_PATH = path.join(process.cwd(), 'src/database/database.sqlite')

export function initDatabase() {
  // Check if the database file exists
  if (!fs.existsSync(DB_PATH)) {
    // Create the database file
    fs.writeFileSync(DB_PATH, '')
    console.log(`Database created at ${DB_PATH}`)
  }

  try {
    const database_dev = new BetterSqlite(DB_PATH, {})
    database_dev.pragma('journal_mode = WAL')
    User.init(database_dev)
    Webhook.init(database_dev)
  } catch (error) {
    console.error('Error initializing the database:', error)
  }
}
