export const User = {
  userTableName: 'users_dev',
  db: null,
  ready: Promise.resolve(),

  /* Initialize connection and ensure table exists */
  init: function (db) {
    console.log(`initiating Dev User Model: ${this.userTableName}`)
    this.db = db
    if (!this.db) {
      throw new Error('Database not provided')
    }

    // check for table existence
    const checkStmt = this.db.prepare(`
      SELECT name FROM sqlite_schema
      WHERE type = 'table' AND name = ?;
    `)
    const rows = checkStmt.all(this.userTableName)
    if (rows.length === 1) {
      this.ready = Promise.resolve()
    } else {
      const createStmt = this.db.prepare(`
        CREATE TABLE ${this.userTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop VARCHAR(511) NOT NULL
        )
      `)
      createStmt.run()
      this.ready = Promise.resolve()
    }
  },

  create: async function ({ shop }) {
    await this.ready
    const existingUser = await this.read(shop)
    if (existingUser) {
      return existingUser
    }

    const insertStmt = this.db.prepare(`INSERT INTO ${this.userTableName} (shop) VALUES (?)`)
    const info = insertStmt.run(shop)

    if (info.changes === 0) {
      throw new Error('Failed to create user record')
    }

    return this.read(shop)
  },

  read: async function (shop) {
    await this.ready
    const stmt = this.db.prepare(`SELECT * FROM ${this.userTableName} WHERE shop = ?`)
    return stmt.get(shop)
  },

  update: async function (id, { shop }) {
    await this.ready
    const stmt = this.db.prepare(`UPDATE ${this.userTableName} SET shop = ? WHERE id = ?`)
    stmt.run(shop, id)
    return true
  },

  delete: async function (shop) {
    await this.ready
    const stmt = this.db.prepare(`DELETE FROM ${this.userTableName} WHERE shop = ?`)
    stmt.run(shop)
    return true
  }
}
