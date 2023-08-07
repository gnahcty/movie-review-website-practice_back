import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, 'Reviewer is required']
  },
  film: {
    type: String,
    required: [true, 'Film is required']
  },
  poster: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  watched: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'invalid rating'],
    max: [5, 'invalid rating']
  },
  like: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String,
    default: ''
  },
  cmtLikes: [{
    type: mongoose.ObjectId,
    ref: 'users'
  }],
  reported: {
    type: Number,
    default: 0
  }
}, { versionKey: false, timestamps: true })

export default mongoose.model('reviews', reviewSchema)
