import mongoose from 'mongoose'
const deletedSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, 'Commenter is required']
  },
  comment: {
    type: String,
    default: ''
  },
  created: {
    type: Date
  },
  reports: {
    type: Number,
    default: 1
  }
}, { versionKey: false, timestamps: true })

export default mongoose.model('deleted', deletedSchema)
