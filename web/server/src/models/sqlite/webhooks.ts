import { Database } from 'sqlite3'
import { Webhook as WebhookType } from '../../types/models.js'

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
  db: null as Database | null,
  ready: null as Promise<void> | null,

  init: async function (db: Database): Promise<void> {
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
      this.db.all(sql, params, (err: Error | null, result: any) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  },

  create: async function (data: WebhookCreate): Promise<number> {
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      this.db!.run(
        `INSERT INTO ${this.webhooksTableName} (
          user_id,
          webhook_id,
          webhook_topic,
          shop,
          timestamp,
          processed
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          data.user_id,
          data.webhook_id,
          data.webhook_topic,
          data.shop,
          data.timestamp,
          data.processed ? 1 : 0
        ],
        function (this: { lastID: number }, err: Error | null) {
          if (err) {
            console.error('Error creating webhook:', err)
            reject(err)
          } else {
            console.log('Webhook created:', this.lastID)
            resolve(this.lastID)
          }
        }
      )
    })
  },

  read: async function (webhookId: string): Promise<WebhookType | undefined> {
    // Changed from number to string
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      this.db!.get(
        `SELECT * FROM ${this.webhooksTableName} WHERE webhook_id = ?`,
        [webhookId],
        (err: Error | null, row: WebhookType) => {
          if (err) {
            console.error('Error reading webhook:', err)
            reject(err)
          } else {
            console.log('Webhook read:', row)
            resolve(row)
          }
        }
      )
    })
  },

  update: async function (webhookId: string, updates: WebhookUpdate): Promise<void> {
    // Changed from number to string
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const updateColumns = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ')
      const updateValues = Object.values(updates)

      this.db!.run(
        `UPDATE ${this.webhooksTableName} SET ${updateColumns} WHERE webhook_id = ?`,
        [...updateValues, webhookId],
        (err: Error | null) => {
          if (err) {
            console.error('Error updating webhook:', err)
            reject(err)
          } else {
            console.log('Webhook updated:', webhookId)
            resolve()
          }
        }
      )
    })
  }
}
