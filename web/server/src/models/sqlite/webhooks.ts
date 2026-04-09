import BetterSqlite3 from 'better-sqlite3'
import { Webhook as WebhookType } from '../../types/models.type.js'

type BetterSQLiteDatabase = InstanceType<typeof BetterSqlite3>

interface WebhookCreate {
  user_id: number | null
  webhook_id: string // Changed from number to string
  webhook_topic: string
  shop: string
  timestamp: string | number
  processed: boolean
}

interface WebhookUpdate {
  [key: string]: any
}

export const Webhook = {
  webhooksTableName: 'webhooks_dev',
  db: null as BetterSQLiteDatabase | null,
  ready: null as Promise<void> | null,

  init: async function (db: BetterSQLiteDatabase): Promise<void> {
    console.log('Initializing DEV DB: webhooks')
    this.db = db
    await this.__query(`PRAGMA foreign_keys = ON;`)

    if (!(await this.__hasWebhooksTable())) {
      const query = `CREATE TABLE ${this.webhooksTableName} (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
                webhook_id TEXT NOT NULL,   /* Changed from INTEGER to TEXT */
                webhook_topic TEXT NOT NULL,
                shop TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                processed BOOLEAN NOT NULL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users_dev(id)
            )`
      await this.__query(query, [])
    }
    this.ready = Promise.resolve()
  },

  __hasWebhooksTable: async function (): Promise<boolean> {
    const query = `SELECT name FROM sqlite_schema WHERE type='table' AND name='${this.webhooksTableName}'`

    const rows = await this.__query(query, [])
    return Array.isArray(rows) && rows.length > 0
  },

  __query: function (sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }
      try {
        const statement = this.db.prepare(sql)
        const result = statement.reader ? statement.all(...params) : statement.run(...params)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  },

  create: async function (data: WebhookCreate): Promise<number> {
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const result = this.db
        .prepare(
          `INSERT INTO ${this.webhooksTableName} (
            user_id,
            webhook_id,
            webhook_topic,
            shop,
            timestamp,
            processed
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          data.user_id,
          data.webhook_id,
          data.webhook_topic,
          data.shop,
          data.timestamp,
          data.processed ? 1 : 0
        )

      const lastId = Number(result.lastInsertRowid)
      console.log('Webhook created:', lastId)
      return lastId
    } catch (err) {
      console.error('Error creating webhook:', err)
      throw err
    }
  },

  read: async function (webhookId: string): Promise<WebhookType | undefined> {
    // Changed from number to string
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const row = this.db
        .prepare(`SELECT * FROM ${this.webhooksTableName} WHERE webhook_id = ?`)
        .get(webhookId) as WebhookType | undefined

      console.log('Webhook read:', row)
      return row
    } catch (err) {
      console.error('Error reading webhook:', err)
      throw err
    }
  },

  update: async function (webhookId: string, updates: WebhookUpdate): Promise<void> {
    // Changed from number to string
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const updateColumns = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ')
      const updateValues = Object.values(updates)

      this.db
        .prepare(`UPDATE ${this.webhooksTableName} SET ${updateColumns} WHERE webhook_id = ?`)
        .run(...updateValues, webhookId)

      console.log('Webhook updated:', webhookId)
    } catch (err) {
      console.error('Error updating webhook:', err)
      throw err
    }
  }
}
