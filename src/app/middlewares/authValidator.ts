import { NextFunction, Request, Response } from 'express'
import catchAsync from './catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/user.interface'
import { User } from '../modules/user/user.model'

const auth = (...roles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    console.log(token)

    //check if the token is sent
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    }

    //check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { userId, role, iat } = decoded

    //if the user exists or not
    const user = await User.isUserExistsByCustomId(userId)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    //checking if the user is already deleted
    if (User.checkIsDeleted(user?.isDeleted)) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted')
    }

    if (User.checkStatus(user?.status)) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    }
    if (roles && !roles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized for this task',
      )
    }
    req.user = decoded as JwtPayload
    next()

    //check if the token is valid
    // jwt.verify(
    //   token,
    //   config.jwt_access_secret as string,
    //   function (err, decoded) {
    //     if (err) {
    //       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    //     }

    //     const role = (decoded as JwtPayload)?.role

    //     if (roles && !roles.includes(role)) {
    //       throw new AppError(
    //         httpStatus.UNAUTHORIZED,
    //         'You are not authorized for this task',
    //       )
    //     }
    //     req.user = decoded as JwtPayload
    //     next()
    //   },
    // )
  })
}

export default auth
