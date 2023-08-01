import mongoose from 'mongoose'

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
  description: {
    type: String
  },
  films: [{
    type: String,
    required: [true, 'Film Id is required']
  }],
  likes: [{
    type: mongoose.ObjectId,
    ref: 'users'
  }]
}, { versionKey: false, timestamps: true })

export default mongoose.model('lists', listSchema)
