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

export const updateAvatar = async (req, res) => {
  try {
    req.user.avatar = `https://source.boringavatars.com/beam/120/${req.user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`
    await req.user.save()
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

export const addToList = async (req, res) => {
  try {
    const { filmID, title, poster } = req.body
    const idx = req.user.watchList.findIndex((film) => film.id === filmID.toString())

    if (idx > -1) {
      req.user.watchList.splice(idx, 1)
    } else {
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
    const top3 = []
    const top20 = []
    const popUsers = await users.find().sort({ followers: -1 }).limit(20)
    for (const i in popUsers) {
      const watched = await reviews.countDocuments({ user: popUsers[i]._id })
      const reviewed = await reviews.countDocuments({
        user: popUsers[i]._id,
        comments: { $ne: '' }
      })
      const latestComments = await reviews.find({
        user: popUsers[i]._id,
        comments: mongoose.trusted({ $ne: '' })
      })
        .sort({ createdAt: -1 })
        .limit(3)
      if (i < 3) {
        top3.push({
          _id: popUsers[i]._id,
          avatar: popUsers[i].avatar,
          username: popUsers[i].username,
          followers: popUsers[i].followers,
          following: popUsers[i].following,
          watched,
          reviewed,
          latestComments
        })
      } else {
        top20.push({
          _id: popUsers[i]._id,
          avatar: popUsers[i].avatar,
          username: popUsers[i].username,
          followers: popUsers[i].followers,
          following: popUsers[i].following,
          watched,
          reviewed,
          latestComments
        })
      }
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      top3,
      top20
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

export const follow = async (req, res) => {
  try {
    const followee = await users.findOne({ username: req.body.username })
    const idx = followee.followers.indexOf(req.user._id)
    if (idx > -1) {
      followee.followers.splice(idx, 1)
    } else {
      followee.followers.push(req.user._id)
    }

    await followee.save()

    const i = req.user.following.indexOf(followee._id)
    if (i > -1) {
      req.user.following.splice(i, 1)
    } else {
      req.user.following.push(followee._id)
    }

    await req.user.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      followee
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error following'
    })
  }
}
