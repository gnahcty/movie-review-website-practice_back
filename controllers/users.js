import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import users from '../models/userSchema.js'
import reviews from '../models/reviewSchema.js'
import { getMessageFromValidationError } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: getMessageFromValidationError(error)
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'account already exists'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'internal server error'
      })
    }
  }
}

export const updateAvatar = (req, res) => {
  try {
    req.user.avatar = `https://source.boringavatars.com/beam/120/${req.user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error updating avatar'
    })
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    req.user.watched = await reviews.countDocuments({ user: req.user._id })
    req.user.reviewed = await reviews.countDocuments({
      user: req.user._id,
      comments: { $ne: '' }
    })
    req.user.latestComments = await reviews.find({
      user: req.user._id,
      comments: mongoose.trusted({ $ne: '' })
    })
      .sort({ createdAt: -1 })
      .limit(3)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        admin: req.user.admin,
        following: req.user.following,
        followers: req.user.followers,
        watchList: req.user.watchList,
        watched: req.user.watched,
        reviewed: req.user.reviewed,
        latestComments: req.user.latestComments
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error'
    })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error'
    })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error'
    })
  }
}

export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        admin: req.user.admin,
        avatar: req.user.avatar,
        following: req.user.following,
        followers: req.user.followers,
        watchList: req.user.watchList
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error'
    })
  }
}

export const addToList = async (req, res) => {
  try {
    const { filmID, title, poster } = req.body

    // Find the index of the film model with the provided film ID in the watchList array
    const idx = req.user.watchList.findIndex((film) => film.id === filmID)

    if (idx > -1) {
      // Film model found, remove it from the watchList
      req.user.watchList.splice(idx, 1)
    } else {
      // Film model not found, add a new film model with the provided details
      req.user.watchList.push({
        id: filmID,
        title,
        poster
      })
    }

    // Save the updated user document
    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.watchList
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error adding watchlist'
    })
  }
}

export const popUser = async (req, res) => {
  try {
    const results = []
    const popUsers = await users.find().sort({ followers: -1 }).limit(3)
    for (const user of popUsers) {
      const watched = await reviews.countDocuments({ user: user._id })
      const reviewed = await reviews.countDocuments({
        user: user._id,
        comments: { $ne: '' }
      })
      const latestComments = await reviews.find({
        user: user._id,
        comments: mongoose.trusted({ $ne: '' })
      })
        .sort({ createdAt: -1 })
        .limit(3)

      results.push({
        _id: user._id,
        avatar: user.avatar,
        username: user.username,
        watched,
        reviewed,
        latestComments
      })
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error fetching pop users',
      error: error.message
    })
  }
}
