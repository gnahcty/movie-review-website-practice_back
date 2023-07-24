import express from 'express'
import { update, getUserReview } from '../controllers/reviews.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()
router.post('/', auth.jwt, update)
router.get('/reviews/user/:filmID', auth.jwt, getUserReview)

export default router
