export const User = {
  userTableName: 'users_dev',
  db: null,
  ready: null,

  create: async function ({ shop }) {
    await this.ready
    // check if user exists
    const existingUser = await this.read(shop)
    if (existingUser) {
      return existingUser
    }
    // create user
    const query = `INSERT INTO ${this.userTableName} (shop) VALUES (?)`
    await this.__query(query, [shop])

    const user = await this.read(shop)

    if (this.db.changes === 0) {
      throw new Error('Failed to create user record')
    }

    return user
  },

  update: async function (id, { shop }) {
    await this.ready

    const query = `UPDATE ${this.userTableName} SET shop=? WHERE id=?`

    await this.__query(query, [shop, id])

    return true
  },
  read: async function (shop) {
    await this.ready
    const query = `SELECT * FROM ${this.userTableName} WHERE shop=?`
    const rows = await this.__query(query, [shop])
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined
    return rows[0]
  },
  delete: async function (shop) {
    await this.ready
    const query = `DELETE FROM ${this.userTableName} WHERE shop=?`
    await this.__query(query, [shop])
    return true
  },

  /* Private */

  __hasUserTable: async function () {
    const query = `
      SELECT name FROM sqlite_schema
      WHERE
        type = 'table' AND
        name = ?;
    `
    const rows = await this.__query(query, [this.userTableName])
    return rows.length === 1
  },
  /* Initializes the connection with the app's sqlite3 database */
  init: async function (db) {
    console.log(`initiating Dev User Model: ${this.userTableName}`)
    this.db = db
    if (!this.db) {
      throw new Error('Database not provided')
    }
    const userTable = await this.__hasUserTable()
    if (userTable) {
      this.ready = Promise.resolve()
      //Create user table if it already hasn't been created
    } else {
      const query = `
        CREATE TABLE ${this.userTableName} (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          shop VARCHAR(511) NOT NULL
        )
      `
      this.ready = this.__query(query)
    }
  },
  /* Perform a query on the database. Used by the various CRUD methods. */
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
  }
}
