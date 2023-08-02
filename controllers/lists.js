import lists from '../models/listSchema.js'
import { StatusCodes } from 'http-status-codes'

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
