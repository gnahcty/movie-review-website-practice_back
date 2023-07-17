import 'dotenv/config'
import { MovieDb } from 'moviedb-promise'
import { StatusCodes } from 'http-status-codes'
const mdb = new MovieDb(process.env.TMDB_API_KEY)

export const getFilms = async (req, res) => {
  try {
    const params = {
      page: 1,
      region: req.params.region,
      with_genres: '',
      year: req.params.year,
      'vote_average.gte': 0
    }
    const results = await mdb.discoverMovie(params)
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

export const searchMovie = async (req, res) => {
  try {
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
