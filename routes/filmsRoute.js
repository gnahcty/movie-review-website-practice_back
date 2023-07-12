import express from 'express'
import { searchMovie } from '../controllers/film.js'
const router = express.Router()
router.get('/:name', searchMovie)

export default router
