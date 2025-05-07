import fs from 'fs'
import path, { dirname } from 'path'
import SQLite from 'sqlite3'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

export const DB_PATH = path.join(process.cwd(), 'src/database/database.sqlite')

// database.ts
export async function initDatabase(): Promise<void> {
  try {
    if (!fs.existsSync(dirname(DB_PATH))) {
      fs.mkdirSync(dirname(DB_PATH), { recursive: true })
    }
    
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, '')
      console.log(`Database created at ${DB_PATH}`)
    }

    const database_dev = new Promise<SQLite.Database>((resolve, reject) => {
      const db = new SQLite.Database(DB_PATH, (err) => {
        if (err) {
          console.error('Error opening database:', err)
          reject(err)
          return
        }
        resolve(db)
      })
    })

    await Promise.all([
      User.init(await database_dev),
      Webhook.init(await database_dev)
    ])
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}