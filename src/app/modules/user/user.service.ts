import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TStudent } from '../student/student.interface'
import { Student } from '../student/student.model'
import { TUser } from './user.interface'
import { User } from './user.model'
import { generateStudentId, generateAdminOrFacultyId } from './users.utils'
import mongoose from 'mongoose'
import { TFaculty } from '../faculty/faculty.interface'
import { Faculty } from '../faculty/faculty.model'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { TAdmin } from '../admin/admin.interface'
import { Admin } from '../admin/admin.model'

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

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department does not exist')
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

const createFacultyintoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {}
  userData.password = password || (config.default_password as string)
  userData.role = 'faculty'

  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department does not exist')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    userData.id = await generateAdminOrFacultyId('F')

    //create a user (transaction-1)
    console.log('before creating user')
    const newUser = await User.create([userData], { session }) // returns array

    //create a student
    if (!newUser.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to create user')
    }

    console.log('after creating user')
    // set _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id

    console.log(payload.academicDepartment)

    //create a student (transaction-2)
    console.log('before creating faculty')
    const newFaculty = await Faculty.create([payload], { session })
    console.log(newFaculty)
    if (!newFaculty.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to create faculty')
    }
    // return newStudent

    console.log('after creating faculty')
    await session.commitTransaction()
    await session.endSession()
    return newFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const createAdminintoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {}
  userData.password = password || (config.default_password as string)
  userData.role = 'admin'

  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    userData.id = await generateAdminOrFacultyId('A')

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
    const newAdmin = await Admin.create([payload], { session })
    if (!newAdmin.length) {
      throw new AppError(httpStatus.NOT_FOUND, 'Failed to create admin')
    }
    // return newStudent

    await session.commitTransaction()
    await session.endSession()
    return newAdmin
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()

    console.log(err.message)
    throw new Error(err)
  }
}

export const UserServices = {
  createStudentintoDB,
  createFacultyintoDB,
  createAdminintoDB,
}
