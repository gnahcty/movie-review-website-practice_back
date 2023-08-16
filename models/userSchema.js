import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const filmSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'film ID is required'],
    unique: true
  },
  title: {
    type: String,
    required: [true, 'title is required'],
    unique: true
  },
  poster: {
    type: String,
    required: [true, 'poster is required']
  }
}, { versionKey: false, timestamps: true })

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required'],
    minLength: [4, 'username must be at least 4 characters long'],
    maxLength: [10, 'username must be at most 20 characters long'],
    unique: true,
    match: [/^([-_A-Za-z0-9]+)$/gm, 'invalid username']
  },
  password: {
    type: String,
    required: [true, 'password is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: 'invalid email'
    }
  },
  tokens: {
    type: [String],
    default: []
  },
  admin: {
    type: Number,
    default: false
  },
  avatar: {
    type: String,
    default: 'https://source.boringavatars.com/beam/120/Annie%20Jump?colors=264653,2a9d8f,e9c46a,f4a261,e76f51'
  },
  following: [{
    type: mongoose.ObjectId,
    ref: 'users'
  }],
  followers: [{
    type: mongoose.ObjectId,
    ref: 'users'
  }],
  watchList: {
    type: [filmSchema],
    default: []
  },
  watched: {
    type: String,
    default: ''
  },
  reviewed: {
    type: String,
    default: ''
  },
  latestComments: {
    type: Array,
    default: []
  }
}, { versionKey: false })

UserSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'password must be at least 4 characters long' }))
      next(error)
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'password must be less than 20 characters' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  next()
})

UserSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length < 4) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'password must be at least 4 characters long' }))
      next(error)
    } else if (user.password.length > 20) {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: 'password must be less than 20 characters' }))
      next(error)
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  } next()
})

export default mongoose.model('users', UserSchema)
