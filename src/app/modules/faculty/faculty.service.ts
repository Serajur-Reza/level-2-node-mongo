import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { facultySearchableFields } from './faculty.constants'
import { TFaculty } from './faculty.interface'
import { Faculty } from './faculty.model'
import { User } from '../user/user.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(facultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await facultyQuery.modelQuery
  return result
}

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findByIdAndUpdate(id)
  return result
}

const updateSingleFacultyFromDB = async (
  id: string,
  data: Partial<TFaculty>,
) => {
  const { name, ...remainingFacultyData } = data
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  console.log(modifiedUpdatedData)

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  })

  return result
}

const deleteSingleFacultyIntoDB = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    )

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty')
    }

    const userId = deletedFaculty.user

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true },
    )
    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }
    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to make transaction')
  }
}

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateSingleFacultyFromDB,
  deleteSingleFacultyIntoDB,
}
