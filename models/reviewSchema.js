import mongoose from 'mongoose'

const cmtSchema = new mongoose.Schema({
  content: {
    type: String,
    default: ''
  },
  // FIXME: 把UID ref到users
  likes: {
    type: [mongoose.ObjectId],
    ref: 'users',
    default: []
  }
}, { versionKey: false })

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, 'List Creator is required']
  },
  film: {
    type: String,
    required: [true, 'Film is required']
  },
  watched: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
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
    type: [cmtSchema],
    default: []
  },
  reported: {
    type: Number,
    default: 0
  }
})

export default mongoose.model('reviews', reviewSchema)
