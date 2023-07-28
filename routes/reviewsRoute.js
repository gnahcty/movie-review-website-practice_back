import express from 'express'
import { update, likeCmt, getUserReview, getReviewDetails, getReviews } from '../controllers/reviews.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()
router.post('/', auth.jwt, update)
router.post('/like', auth.jwt, likeCmt)
router.post('/user', auth.jwt, getUserReview)
router.get('/user/:filmID', auth.jwt, getReviewDetails)
router.get('/:filmID', getReviews)

export default router
