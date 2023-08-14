import express from 'express'
import { getListDetails, getPopLists, getUserLists, getNewLists, updateList, createList } from '../controllers/lists.js'
import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.get('/pop', getPopLists)
router.get('/new', getNewLists)
// router.get('/picks', getPickedLists)
router.get('/:id', getListDetails)
router.get('/user', auth.jwt, getUserLists)
router.post('/create', auth.jwt, createList)
router.post('/update', auth.jwt, updateList)
export default router
