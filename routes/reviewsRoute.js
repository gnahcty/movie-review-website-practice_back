import express from 'express'
import { adminDelete, getDeleted, getFriendReview, popReviews, del, report, update, likeCmt, getUserReview, getReviewDetails, getReviews, getReported } from '../controllers/reviews.js'
import * as auth from '../middlewares/auth.js'
import admin from '../middlewares/admin.js'

const router = express.Router()
router.post('/', auth.jwt, update)
router.get('/pop', popReviews)
router.post('/delete', auth.jwt, del)
router.post('/report', auth.jwt, report)
router.get('/report', auth.jwt, admin, getReported)
router.post('/admin/delete', auth.jwt, admin, adminDelete)
router.get('/deleted', auth.jwt, admin, getDeleted)
router.post('/like', auth.jwt, likeCmt)
router.post('/user', auth.jwt, getUserReview)
router.get('/user/:filmID', auth.jwt, getReviewDetails)
router.get('/:filmID/friend', auth.jwt, getFriendReview)
router.get('/:filmID', getReviews)

export default router
