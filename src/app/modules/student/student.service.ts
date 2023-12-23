import mongoose from 'mongoose'
import { TStudent } from './student.interface'
import { Student } from './student.model'
import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFields } from './student.constant'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  // const queryCopy = { ...query }
  // let searchTerm = ''
  // if (query.searchTerm) {
  //   searchTerm = query?.searchTerm as string
  // }
  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map(field => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // })
  // const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
  // excludeFields.forEach(el => delete queryCopy[el])
  // const filterQuery = searchQuery
  //   .find(queryCopy)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   })
  // let sortVar: any = '-createdAt'
  // if (query.sort) {
  //   sortVar = query.sort as string
  // }
  // // console.log(sortVar)
  // const sortQuery = filterQuery.sort(sortVar)
  // let page = 1
  // let limit = 2
  // let skip = 0
  // if (query.limit) {
  //   limit = Number(query.limit)
  // }
  // if (query.page) {
  //   page = Number(query.page)
  //   skip = (page - 1) * limit
  // }
  // const paginateQuery = sortQuery.skip(skip)
  // const limitQuery = paginateQuery.limit(limit)
  // // console.log('kutta', limit)
  // // const limitQuery = await filterQuery.limit(limit)
  // let fields = '-__v'
  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join('')
  // }
  // const fieldQuery = await limitQuery.select(fields)
  // return fieldQuery
  const studentQuery = new QueryBuilder(Student.find().populate('user'), query)
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await studentQuery.modelQuery
  const meta = await studentQuery.countTotal()
  return { meta, result }
}

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id })
  const result = await Student.findById(id).populate([
    'admissionSemester',
    {
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    },
  ])
  return result
}

const updateStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value
    }
  }

  console.log(modifiedUpdatedData)

  const result = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  })

  return result
}

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession()
  console.log(id)
  try {
    session.startTransaction()
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete stduent')
    }

    const userId = deletedStudent.user

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction()
    await session.endSession()
    return deletedStudent
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete transaction user',
    )
  }
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentFromDB,
  deleteStudentFromDB,
}
