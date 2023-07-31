import express from 'express'
import { getAll } from '../controllers/lists.js'
// import * as auth from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getAll)
