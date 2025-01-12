import fs from 'fs'
import path from 'path'
import SQLite from 'sqlite3'
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

  const database_dev = new SQLite.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database', err)
      throw new Error('Failed to connect to database')
    }
    console.log('Connected to the SQLite database')
  })

  User.init(database_dev)
  Webhook.init(database_dev)
}
