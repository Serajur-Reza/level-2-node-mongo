import { Schema, model } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../../config'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: { type: String, required: true, unique: true },
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// pre save middleware

userSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
  // console.log(this, 'pre hook: we will save the data')
})

//post save middleware
userSchema.post('save', function (doc, next) {
  doc.password = ''
  console.log(this, 'post hook: we saved the data')
  next()
})

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return bcrypt.compare(plainTextPassword, hashedPassword)
}

userSchema.statics.checkIsDeleted = function (status) {
  return status
}

userSchema.statics.checkStatus = function (status) {
  return status === 'blocked'
}

userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimeStamp,
  jwtIssuedTimeStamp,
) {
  return (
    Number(new Date(passwordChangedTimeStamp).getTime() / 1000) >
    jwtIssuedTimeStamp
  )
}

export const User = model<TUser, UserModel>('User', userSchema)
