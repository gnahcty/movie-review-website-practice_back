import express from 'express'
import { getRecent } from '../controllers/profiles.js'
const router = express.Router()

router.get('/recent/:username', getRecent)

export default router
