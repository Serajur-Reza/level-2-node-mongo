import { Response } from 'express'

export type TMeta = {
  page: number
  limit: number
  total: number
  totalPage: number
}

interface IResponse<T> {
  statusCode: number
  success: boolean
  message?: String
  meta?: TMeta
  data: T
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  })
}

export default sendResponse
