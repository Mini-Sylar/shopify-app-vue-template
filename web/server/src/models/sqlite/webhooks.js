export const Webhook = {
  webhooksTableName: 'webhooks_dev',
  db: null,
  ready: null,

  init: async function (db) {
    console.log('Initializing DEV DB: webhooks')
    this.db = db
    await this.__query(`PRAGMA foreign_keys = ON;`)

    if (!(await this.__hasWebhooksTable())) {
      const query = `CREATE TABLE ${this.webhooksTableName} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        webhook_id TEXT NOT NULL,
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

  __hasWebhooksTable: async function () {
    const query = `SELECT name FROM sqlite_schema WHERE type='table' AND name='${this.webhooksTableName}'`
    const rows = await this.__query(query, [])
    return Array.isArray(rows) && rows.length > 0
  },

  __query: function (sql, params = []) {
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

  create: async function ({ user_id, webhook_id, webhook_topic, shop, timestamp, processed }) {
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const result = this.db
        .prepare(
          `INSERT INTO ${this.webhooksTableName} (
            user_id, webhook_id, webhook_topic, shop, timestamp, processed
          ) VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(user_id, webhook_id, webhook_topic, shop, timestamp, processed ? 1 : 0)

      const lastId = Number(result.lastInsertRowid)
      console.log('Webhook created:', lastId)
      return lastId
    } catch (err) {
      console.error('Error creating webhook:', err)
      throw err
    }
  },

  read: async function (webhookId) {
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const row = this.db
        .prepare(`SELECT * FROM ${this.webhooksTableName} WHERE webhook_id = ?`)
        .get(webhookId)
      console.log('Webhook read:', row)
      return row
    } catch (err) {
      console.error('Error reading webhook:', err)
      throw err
    }
  },

  update: async function (webhookId, updates) {
    await this.ready
    if (!this.db) throw new Error('Database not initialized')

    try {
      const updateColumns = Object.keys(updates).map((key) => `${key} = ?`).join(', ')
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
