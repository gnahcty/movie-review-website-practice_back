import lists from '../models/listSchema.js'
import users from '../models/userSchema.js'
import reviews from '../models/reviewSchema.js'
// import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

export const getRecent = async (req, res) => {
  try {
    // get user profile
    const profile = await users.findOne({ username: req.params.username }).populate('following', 'username avatar').populate('followers', 'username avatar')
    // get recent reviews
    const userReviews = await reviews.find({ user: profile._id }).sort({ createdAt: -1 })
    // get user lists
    const userLists = await lists.find({ user: profile._id }).sort({ createdAt: -1 })
    // get watched film count
    const watched = await reviews.countDocuments({ user: profile._id })
    // get reviewed film count
    const reviewed = await reviews.countDocuments({
      user: profile._id,
      comments: { $ne: '' }
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        profile: {
          username: req.params.username,
          avatar: profile.avatar,
          followers: profile.followers,
          following: profile.following,
          watched,
          reviewed
        },
        watchlist: profile.watchList,
        userReviews,
        userLists
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error getting recent profile',
      error
    })
  }
}

export const getFavs = async (req, res) => {
  try {
    const user = await users.findOne({ username: req.params.username }).populate('following', 'username avatar')
    // cmt - liked films
    const films = await reviews.find({ user: user._id, like: true }).sort({ createdAt: -1 }).limit(12)

    // list - liked lists
    const likedLists = await lists.find({ likes: user._id }).populate('user', 'username avatar').sort({ createdAt: -1 }).limit(12)

    // cmt- liked cmts
    const cmts = await reviews.find({ cmtLikes: user._id }).populate('user', 'username avatar')
      .sort({ createdAt: -1 }).limit(12)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        films,
        cmts,
        likedLists
      }
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error getting user favorites',
      error
    })
  }
}
