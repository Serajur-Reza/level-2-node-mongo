import mongoose, { Schema, model } from 'mongoose'
import { FacultyModel, TFaculty, TName } from './faculty.interface'

const nameSchema = new Schema<TName>({
  firstName: { type: String, required: true },
  middleName: { type: String, required: true },
  lastName: { type: String, required: true },
})

const facultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user id is required'],
      unique: true,
      ref: 'User',
    },
    designation: { type: String, required: true },
    name: { type: nameSchema, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: Date },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    profileImg: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
)

//virtual
facultySchema.virtual('fullName').get(function () {
  return `${this.name.firstName}  ${this.name.middleName}  ${this.name.lastName}`
})

// query middleware

facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

facultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

//creating custom static method

facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id })
  return existingUser
}

//creating custom instance method

// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id })
//   return existingUser
// }

export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema)
