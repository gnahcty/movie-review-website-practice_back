import express from 'express'
import { searchMovie, getFilms } from '../controllers/film.js'
const router = express.Router()
router.get('/search/:title', searchMovie)
router.get('/films', getFilms)

export default router
