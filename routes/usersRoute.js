import express from 'express'
import contentType from '../middlewares/contentType.js'
import { follow, popUser, createUser, login, logout, extend, getProfile, addToList } from '../controllers/users.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.post('/', contentType('application/json'), createUser)
router.post('/login', contentType('application/json'), auth.login, login)
router.get('/pop', popUser)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/profile', auth.jwt, getProfile)
router.post('/watchList', auth.jwt, addToList)
router.post('/follow', auth.jwt, follow)

export default router
