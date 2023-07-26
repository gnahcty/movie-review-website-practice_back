import { StatusCodes } from 'http-status-codes'
import users from '../models/userSchema.js'
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

// TODO: user avatar
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        username: req.user.username,
        email: req.user.email,
        admin: req.user.admin,
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

// TODO: user avatar
export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        username: req.user.username,
        email: req.user.email,
        admin: req.user.admin,
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
    const idx = req.user.watchList.indexOf(req.body.filmID)
    console.log(idx)
    if (idx > -1) {
      req.user.watchList.splice(idx, 1)
    } else {
      req.user.watchList.push(req.body.filmID)
    }
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: req.user.watchList.length
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error adding watchlist'
    })
  }
}
