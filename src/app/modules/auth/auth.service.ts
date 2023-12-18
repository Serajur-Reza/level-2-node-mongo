import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import config from '../../config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils'

const loginUser = async (payload: TLoginUser) => {
  //if the user exists or not
  const ifUserExists = await User.isUserExistsByCustomId(payload.id)
  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  //checking if the user is already deleted
  if (User.checkIsDeleted(ifUserExists?.isDeleted)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted')
  }

  if (User.checkStatus(ifUserExists?.status)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
  }

  //checking if the password is correct
  if (
    !(await User.isPasswordMatched(payload.password, ifUserExists?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Passwords do not match')
  }

  //create token and send to client

  const jwtPayload = {
    userId: ifUserExists.id,
    role: ifUserExists.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_access_refresh_expires_in as string,
  )
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: ifUserExists?.needsPasswordChange,
  }
}

const changePasswordService = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  //if the user exists or not
  const ifUserExists = await User.isUserExistsByCustomId(userData.userId)
  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  //checking if the user is already deleted
  if (User.checkIsDeleted(ifUserExists?.isDeleted)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is deleted')
  }

  if (User.checkStatus(ifUserExists?.status)) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
  }

  //checking if the password is correct
  if (
    !(await User.isPasswordMatched(payload.oldPassword, ifUserExists?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Passwords do not match')
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: hashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshToken = async (token: string) => {
  // if (!token) {
  //   throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  // }

  //check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload

  const { userId, iat } = decoded

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
    User.isJWTIssuedBeforePasswordChange(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_secret_expires_in as string,
  )

  return { accessToken }
}

export const AuthServices = { loginUser, changePasswordService, refreshToken }
