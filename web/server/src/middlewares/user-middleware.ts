import { Request, Response, NextFunction } from 'express'
import { User } from '../models/sqlite/user.js'

// create a user after installing the app
export async function registerUser(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const shop = req.query.shop
    if (typeof shop !== 'string') {
      throw new Error('Shop parameter is required and must be a string')
    }
    await User.create({ shop })
    next()
  } catch (error) {
    console.log(error)
    // ! fails silently to not disrupt the auth flow
    next(error)
  }
}
