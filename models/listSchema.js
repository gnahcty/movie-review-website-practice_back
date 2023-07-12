import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'userSchema',
    required: [true, 'User is required']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

const filmSchema = new mongoose.Schema({
  filmId: {
    type: String,
    required: [true, 'Film Id is required']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'userSchema',
    required: [true, 'List Creator is required']
  },
  film: {
    type: [filmSchema],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: [likeSchema],
    default: []
  }
}, { versionKey: false })

export default mongoose.model('lists', listSchema)
