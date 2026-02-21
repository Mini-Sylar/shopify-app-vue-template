export const Webhook = {
  webhooksTableName: 'webhooks_dev',
  db: null,
  ready: Promise.resolve(),

  init: function (db) {
    console.log('Initializing DEV DB: webhooks')
    this.db = db
    if (!this.db) {
      throw new Error('Database not provided')
    }

    // enable foreign key support
    this.db.pragma('foreign_keys = ON')

    const checkStmt = this.db.prepare(
      `SELECT name FROM sqlite_schema WHERE type='table' AND name = ?`
    )
    const rows = checkStmt.all(this.webhooksTableName)

    if (rows.length === 0) {
      const createStmt = this.db.prepare(`
              CREATE TABLE ${this.webhooksTableName} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                webhook_id TEXT NOT NULL,
                webhook_topic TEXT NOT NULL,
                shop TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                processed BOOLEAN NOT NULL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users_dev(id)
            )`)
      createStmt.run()
    }

    this.ready = Promise.resolve()
  },

  create: async function ({ user_id, webhook_id, webhook_topic, shop, timestamp, processed }) {
    await this.ready
    const stmt = this.db.prepare(
      `INSERT INTO ${this.webhooksTableName} (
          user_id,
          webhook_id,
          webhook_topic,
          shop,
          timestamp,
          processed
        ) VALUES (?, ?, ?, ?, ?, ?)`
    )

    const info = stmt.run(user_id, webhook_id, webhook_topic, shop, timestamp, processed ? 1 : 0)
    console.log('Webhook created:', info.lastInsertRowid)
    return info.lastInsertRowid
  },

  read: async function (webhookId) {
    await this.ready
    const stmt = this.db.prepare(`SELECT * FROM ${this.webhooksTableName} WHERE webhook_id = ?`)
    const row = stmt.get(webhookId)
    console.log('Webhook read:', row)
    return row
  },

  update: async function (webhookId, updates) {
    await this.ready
    const updateColumns = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ')
    const updateValues = Object.values(updates)

    const stmt = this.db.prepare(
      `UPDATE ${this.webhooksTableName} SET ${updateColumns} WHERE webhook_id = ?`
    )
    stmt.run(...updateValues, webhookId)
    console.log('Webhook updated:', webhookId)
    return true
  }
}
