import express from 'express'
import { searchMovie, getMovieDetails, getFilms, searchCrew, trending } from '../controllers/film.js'
const router = express.Router()

router.get('/trending', trending)
router.get('/allFilms', getFilms)
router.post('/search', searchMovie)
router.get('/:id', getMovieDetails)
router.get('/:id/crew', searchCrew)

export default router
