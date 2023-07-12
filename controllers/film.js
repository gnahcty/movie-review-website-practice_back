import Moviedb from 'moviedb'
import { StatusCodes } from 'http-status-codes'

const mdb = new Moviedb(process.env.TMDB_API_KEY)

export const searchMovie = async (req, res) => {
  console.log('searching movie')
  try {
    // const { query } = req.query
    const results = await mdb.searchMovie({ query: req.params.name })
    console.log(results)
    if (!results) {
      throw new Error('NOT FOUND')
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
}
