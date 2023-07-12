import { StatusCodes } from 'http-status-codes'

export default (req, res, next) => {
  if (req.user.admin === 0) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'staff only'
    })
  } else {
    next()
  }
}
