import lists from '../models/listSchema.js'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

export const getPopLists = async (req, res) => {
  try {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const results = await lists
      .find({
        createdAt: mongoose.trusted({ $gte: lastMonth })
      })
      .populate('user', 'username avatar')
      .sort({ likes: -1 })
      .limit(12)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error fetching pop lists',
      error: error.message
    })
  }
}

export const getNewLists = async (req, res) => {
  try {
    const results = await lists
      .find({}).populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(12)

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error fetching new lists',
      error: error.message
    })
  }
}

export const getListDetails = async (req, res) => {
  try {
    const results = await lists.findOne({ _id: req.params.id }).populate('user', 'username avatar')

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      results
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error getting list'
    })
  }
}

export const getUserLists = async (req, res) => {
  try {
    const UserLists = await lists.find({ user: req.user._id })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      UserLists
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error getting user list'
    })
  }
}

export const createList = async (req, res) => {
  try {
    const newList = await lists.create({
      name: req.body.name,
      user: req.user._id,
      description: req.body.description,
      films: req.body.films
    })
    await newList.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      newList
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating list'
    })
  }
}

export const updateDescription = async (req, res) => {
  try {
    const list = await lists.findOneAndUpdate({ _id: req.body._id }, { description: req.body.description }, { new: true })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      list
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating list description'
    })
  }
}

export const updateList = async (req, res) => {
  try {
    const list = await lists.findOne({ _id: req.body._id }
    )
    const { id, title, poster } = req.body.film
    const idx = list.films.findIndex((film) => film.id === id)
    if (idx === -1) {
      list.films.push({ id, title, poster })
    } else {
      list.films.splice(idx, 1)
    }
    await list.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      list
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating list'
    })
  }
}

export const like = async (req, res) => {
  try {
    const list = await lists.findById(req.body.id)
    const idx = list.likes.indexOf(req.user._id)
    if (idx > -1) {
      list.likes.splice(idx, 1)
    } else {
      list.likes.push(req.user._id)
    }

    await list.save()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      list
    })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'error liking list',
      error
    })
  }
}

export const deleteList = async (req, res) => {
  try {
    const deleted = await lists.findOneAndRemove({ _id: req.body.id, user: req.user._id })
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      deleted
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting list'
    })
  }
}
