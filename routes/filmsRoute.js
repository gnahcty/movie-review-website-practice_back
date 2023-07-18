import express from 'express'
import { searchMovie, getFilms, searchCrew, inFlmRoute } from '../controllers/film.js'
const router = express.Router()
router.get('/', inFlmRoute)
router.get('/allFilms', getFilms)
router.get('/:id', searchMovie)
router.get('/:id/crew', searchCrew)

export default router
