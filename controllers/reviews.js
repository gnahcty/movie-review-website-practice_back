import reviews from '../models/reviewSchema.js'
// import { getMessageFromValidationError } from '../utils/error.js'
import { StatusCodes } from 'http-status-codes'

export const getUserReview = async (req, res) => {
  try {
    const result = await reviews.findOne({ user: req.user._id, film: req.params.filmID })
    console.log(result)
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong when getting review'
    })
  }
}

export const update = async (req, res) => {
  try {
    const { filmID, ratings, like, comments, watched, reported } = req.body
    const userID = req.user._id

    // Search the collection to check if the document exists
    const existingReview = await reviews.findOne({ user: userID, film: filmID })

    if (existingReview) {
      const result = await updateReview(existingReview, ratings, like, comments, watched)

      res.status(StatusCodes.OK).json({
        success: true,
        message: '',
        result
      })
    } else {
      const result = await createReview(userID, filmID, ratings, like, comments, watched, reported)

      res.status(StatusCodes.OK).json({
        success: true,
        message: '',
        result
      })
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

const updateReview = async (existingReview, ratings, like, comments, watched) => {
  try {
    // update with the provided data
    existingReview.ratings = ratings || existingReview.ratings
    existingReview.like = like ?? existingReview.like
    existingReview.comments = comments || existingReview.comments
    existingReview.watched = watched ?? existingReview.watched

    // Check if ratings, like, and comments match the default state
    const hasDefaultData = existingReview.ratings === 0 && existingReview.like === false && existingReview.comments.length === 0
    if (hasDefaultData && existingReview.watched === false) {
      // If all match the default state, delete the document
      await reviews.deleteOne({ _id: existingReview._id })
      return 'deleted'
    } else {
      // If any of the ratings, like, or comments does not match the default state,
      // set watched to true
      existingReview.watched = true
      await existingReview.save()
      return existingReview
    }
  } catch (error) {
    // Handle specific error for updating an existing review
    throw new Error('Error updating existing review: ' + error.message)
  }
}

const createReview = async (userID, filmID, ratings, like, comments, watched, reported) => {
  try {
    const newReview = await reviews.create({
      user: userID,
      film: filmID,
      watched: watched ?? false,
      ratings: ratings || 0,
      like: like ?? false,
      comments: comments || '',
      reported: 0
    })
    // Save the new document to the database
    await newReview.save()
    return newReview
  } catch (error) {
    // Handle specific error for creating a new review
    throw new Error('Error creating new review: ' + error.message)
  }
}
