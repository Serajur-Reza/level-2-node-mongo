import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TAcedemicSemester } from '../academicSemester/academicSemester.interface'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { NewUser, TUser } from './user.interface'
import { User } from './user.model'
import generateStudentId from './users.utils'
import mongoose from 'mongoose'

const createStudentintoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}
  userData.password = password || (config.default_password as string)
  userData.role = 'student'

  //find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  )

  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester does not exist')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    userData.id = await generateStudentId(admissionSemester)

    //create a user (transaction-1)
    const newUser = await User.create([userData], { session }) // returns array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to create user')
    }

    // set _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id

    //create a student (transaction-2)
    const newStudent = await Student.create([payload], { session })
    if (!newStudent.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to create stduent')
    }
    // return newStudent

    await session.commitTransaction()
    await session.endSession()
    return newStudent
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Failed to create transaction student',
    )
  }
}

export const UserServices = {
  createStudentintoDB,
}
