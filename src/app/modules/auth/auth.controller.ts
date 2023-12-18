import { Request, Response } from 'express'
import catchAsync from '../../middlewares/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import { AuthServices } from './auth.service'
import config from '../../config'

const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body)

  const { refreshToken, accessToken, needsPasswordChange } = result
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_dev === 'production',
    httpOnly: true,
  })
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully logged in!',
    data: {
      accessToken,
      needsPasswordChange,
    },
  })
})

const changePasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { ...passwordData } = req.body
    const result = await AuthServices.changePasswordService(
      req.user,
      passwordData,
    )
    console.log(req.user, req.body)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Successfully changed password!',
      data: result,
    })
  },
)

const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const result = await AuthServices.refreshToken(refreshToken)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    })
  },
)
export const AuthControllers = {
  loginUserController,
  changePasswordController,
  refreshTokenController,
}
