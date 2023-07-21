import reviews from '../models/reviewSchema.js'
// import { getMessageFromValidationError } from '../utils/error.js'
import { StatusCodes } from 'http-status-codes'

export const createReview = async (req, res) => {
  try {
    await reviews.create({
      user: req.user._id,
      film: req.body.film,
      date: req.body.date,
      watched: req.body.watched,
      ratings: req.body?.ratings,
      like: req.body?.like,
      cmt: req.body?.cmt,
      reported: req.body?.reported
    })
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'something went wrong'
    })
  }
}

// export const get = async (req, res) => {
//   try {
//     const result = await reviews. find
//   } catch (error) {

//   }
// }
