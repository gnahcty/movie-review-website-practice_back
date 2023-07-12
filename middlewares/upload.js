import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter (req, file, cb) {
    if (['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    }
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  upload.single('image')(req, res, error => {
    if (error instanceof multer.MulterError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: error.code
      })
    } else if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'error'
      })
    } else {
      next()
    }
  })
}
