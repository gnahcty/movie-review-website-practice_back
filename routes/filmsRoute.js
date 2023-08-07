import express from 'express'
import { trending, searchMovie, getMovieDetails, getFilms, searchCrew, inFlmRoute } from '../controllers/film.js'
const router = express.Router()
router.get('/', inFlmRoute)
router.get('/trending', trending)
router.get('/allFilms', getFilms)
router.get('/search/:title', searchMovie)
router.get('/:id', getMovieDetails)
router.get('/:id/crew', searchCrew)

export default router
