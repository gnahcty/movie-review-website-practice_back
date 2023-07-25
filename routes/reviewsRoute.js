import express from 'express'
import { update, getUserReview, getReviewDetails } from '../controllers/reviews.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()
router.post('/', auth.jwt, update)
router.post('/user', auth.jwt, getUserReview)
router.get('/user/:filmID', auth.jwt, getReviewDetails)

export default router
