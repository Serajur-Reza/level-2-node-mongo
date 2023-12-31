import { Schema, model, connect } from 'mongoose'
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from './student.interface'
import validator from 'validator'
import bcrypt from 'bcrypt'
import config from '../../config'
import { NextFunction } from 'express'

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'firstName is missing'],
    trim: true,
    maxlength: [20, 'FirstName cannot be more than 20 characters'],
    validate: {
      validator: function (value: string) {
        const nameStr = value.charAt(0).toUpperCase() + value.slice(1)

        return value === nameStr ? true : false
      },
      message: '{VALUE} is not a captalized format',
    },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'lastName is missing'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
})

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: [true, 'fatherName is missing'] },
  fatherOccupation: {
    type: String,
    required: [true, 'fatherOccupation is missing'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'fatherContactNo is missing'],
  },
  motherName: { type: String, required: [true, 'motherName is missing'] },
  motherOccupation: {
    type: String,
    required: [true, 'motherOccupation is missing'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'motherContactNo is missing'],
  },
})

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: [true, 'name is missing'] },
  occupation: { type: String, required: [true, 'occupation is missing'] },
  contactNo: { type: String, required: [true, 'contactNo is missing'] },
  address: { type: String, required: [true, 'address is missing'] },
})

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, unique: true, required: [true, 'id is missing'] },
    password: {
      type: String,
      required: [true, 'password is missing'],
      maxlength: [20, 'Password cannot be more than 20 characters'],
    },
    name: { type: userNameSchema, required: [true, 'name is missing'] },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message:
          "The gender can be one of the following, 'male' 'female'. {VALUE} is not supported",
      },
      required: [true, 'gender is missing'],
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: [true, 'email is missing'],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not valid email',
      },
    },
    contactNumber: { type: String },
    emergencyContactNo: { type: String },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      required: [true, 'bloodGroup is missing'],
    },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    guardian: { type: guardianSchema, required: [true, 'guardian is missing'] },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'localGuardian is missing'],
    },
    profileImg: { type: String },
    active: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

//virtual
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName}  ${this.name.middleName}  ${this.name.lastName}`
})

// pre save middleware

studentSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
  // console.log(this, 'pre hook: we will save the data')
})

//post save middleware
studentSchema.post('save', function (doc, next) {
  doc.password = ''
  console.log(this, 'post hook: we saved the data')
  next()
})

// query middleware

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

//creating custom static method

studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id })
  return existingUser
}

//creating custom instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser
// }

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
