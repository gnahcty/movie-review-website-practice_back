import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import usersRoute from './routes/usersRoute.js'
import filmsRoute from './routes/filmsRoute.js'
import './passport/passport.js'

const app = express()

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: 'Too many requests from this IP, please try again in an hour',
  handler (req, res, next, options) {
    res.status(options.statusCode).json({
      success: false,
      message: options.message
    })
  }
}))

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  }
}))

app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: true,
    message: 'Not allowed by CORS'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: true,
    message: 'invalid JSON'
  })
})

app.use(mongoSanitize())

app.use('/users', usersRoute)
app.use('/films', filmsRoute)

app.all('*', (_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found'
  })
})

app.listen(process.env.PORT || 4000, async () => {
  console.log('server up')
  await mongoose.connect(process.env.DB_URL)
  mongoose.set('sanitizeFilter', true)
  console.log('database connected')
})
