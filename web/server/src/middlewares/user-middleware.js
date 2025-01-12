import { User } from '../models/sqlite/user.js'

// create a user after installing the app

export async function registerUser(req, res, next) {
  try {
    const { shop } = req.query
    await User.create({ shop })
    next()
  } catch (error) {
    console.log(error)
    // ! fails silently
    next(error)
  }
}
