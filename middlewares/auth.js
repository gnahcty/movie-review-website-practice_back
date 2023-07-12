import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: info.message
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'JWT error'
        })
      } else {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message || 'error'
        })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
