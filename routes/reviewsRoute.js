import express from 'express'
import { createReview } from '../controllers/reviews.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/reviews', auth.jwt, createReview)

export default router
