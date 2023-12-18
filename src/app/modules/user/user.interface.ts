import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export interface TUser {
  id: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'admin' | 'student' | 'faculty'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export type NewUser = {
  id: string
  role: string
  password: string
}

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>

  checkIsDeleted(status: boolean): boolean
  checkStatus(status: string): boolean
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE
