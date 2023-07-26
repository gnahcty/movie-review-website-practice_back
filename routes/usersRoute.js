import express from 'express'
import contentType from '../middlewares/contentType.js'
import { createUser, login, logout, extend, getProfile, addToList } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', contentType('application/json'), createUser)
router.post('/login', contentType('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/profile', auth.jwt, getProfile)
router.post('/watchList', auth.jwt, addToList)

export default router
