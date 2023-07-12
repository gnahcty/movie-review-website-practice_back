import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/userSchema.js'

passport.use('login', new passportLocal.Strategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await users.findOne({ username })
    if (!user) {
      throw new Error('no such user')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('wrong password')
    }
    return done(null, user)
  } catch (error) {
    return done(null, false, { message: error.message || 'error' })
  }
}))

passport.use('jwt', new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  ignoreExpiration: true
}, async (req, payload, done) => {
  try {
    const expired = payload.exp * 1000 < Date.now()
    const url = req.baseUrl + req.path
    if (expired && url !== '/users/extend' && url !== '/users/logout') {
      throw new Error('login expired')
    }
    const token = req.headers.authorization.split(' ')[1]

    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (!user) {
      throw new Error('user not found')
    }
    return done(null, { user, token })
  } catch (error) {
    return done(null, false, { message: error.message || 'error' })
  }
}))
