import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'userSchema',
    required: [true, 'User is required']
  }
}, { versionKey: false, timestamps: true })

const filmSchema = new mongoose.Schema({
  filmId: {
    type: String,
    required: [true, 'Film Id is required']
  },
  unique: true
}, { versionKey: false, timestamps: true })

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
  likes: {
    type: [likeSchema],
    default: []
  }
}, { versionKey: false, timestamps: true })

export default mongoose.model('lists', listSchema)
