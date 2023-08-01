import express from 'express'
import { getUserLists, updateList, createList } from '../controllers/lists.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.get('/user', auth.jwt, getUserLists)
router.post('/create', auth.jwt, createList)
router.post('/update', auth.jwt, updateList)
export default router
