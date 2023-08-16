import express from 'express'
import { getRecent, getFavs } from '../controllers/profiles.js'
const router = express.Router()

router.get('/recent/:username', getRecent)
router.get('/likes/:username', getFavs)

export default router
