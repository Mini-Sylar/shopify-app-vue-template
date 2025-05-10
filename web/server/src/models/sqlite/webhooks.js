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
    return rows.length > 0
  },

  __query: function (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  },

  create: async function ({ user_id, webhook_id, webhook_topic, shop, timestamp, processed }) {
    await this.ready
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO ${this.webhooksTableName} (
          user_id,
          webhook_id,
          webhook_topic,
          shop,
          timestamp,
          processed
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [user_id, webhook_id, webhook_topic, shop, timestamp, processed ? 1 : 0],
        function (err) {
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

  read: async function (webhookId) {
    await this.ready
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${this.webhooksTableName} WHERE webhook_id = ?`,
        [webhookId],
        (err, row) => {
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

  update: async function (webhookId, updates) {
    await this.ready
    return new Promise((resolve, reject) => {
      const updateColumns = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ')
      const updateValues = Object.values(updates)

      this.db.run(
        `UPDATE ${this.webhooksTableName} SET ${updateColumns} WHERE webhook_id = ?`,
        [...updateValues, webhookId],
        (err) => {
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
