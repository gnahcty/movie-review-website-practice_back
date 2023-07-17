import express from 'express'
import { searchMovie, getFilms, searchCrew } from '../controllers/film.js'
const router = express.Router()
router.get('/:id', searchMovie)
router.get('/:id/crew', searchCrew)
router.get('/allFilms', getFilms)

export default router
