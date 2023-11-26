import { Request, Response, NextFunction } from 'express'

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'something went wrong'

  return res.status(statusCode).json({
    success: false,
    message: err.message || message,
    error: err,
  })
}

export default globalErrorHandler
