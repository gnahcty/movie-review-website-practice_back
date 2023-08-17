import 'dotenv/config'
import { MovieDb } from 'moviedb-promise'
import { StatusCodes } from 'http-status-codes'
const mdb = new MovieDb(process.env.TMDB_API_KEY)

export const trending = async (req, res) => {
  try {
    const results = await mdb.trending({ media_type: 'movie', time_window: 'week' })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getFilms = async (req, res) => {
  try {
    const params = {
      page: req.query.page || 1,
      region: req.query.region,
      with_genres: req.query.genres,
      'vote_average.gte': req.query.rating,
      year: req.query.year
    }
    const results = await mdb.discoverMovie(params)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const searchMovie = async (req, res) => {
  try {
    // console.log('searchMovie')
    const results = await mdb.searchMovie(req.params.title)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
}

export const getMovieDetails = async (req, res) => {
  try {
    // console.log(' getMovieDetails')
    const results = await mdb.movieInfo({ id: req.params.id })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const searchCrew = async (req, res) => {
  try {
    const results = await mdb.movieCredits({ id: req.params.id })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
