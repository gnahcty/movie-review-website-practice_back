import mongoose from 'mongoose'

const filmSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'film ID is required']
  },
  title: {
    type: String,
    required: [true, 'title is required']
  },
  poster: {
    type: String,
    required: [true, 'poster is required']
  }
}, { versionKey: false, timestamps: true })

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, 'List Creator is required']
  },
  description: {
    type: String
  },
  films: [filmSchema],
  likes: [{
    type: mongoose.ObjectId,
    ref: 'users'
  }]
}, { versionKey: false, timestamps: true })

export default mongoose.model('lists', listSchema)
