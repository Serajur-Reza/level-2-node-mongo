import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { adminSearchableFields } from './admin.constants'
import { TAdmin } from './admin.interface'
import { Admin } from './admin.model'
import { User } from '../user/user.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await adminQuery.modelQuery
  const meta = await adminQuery.countTotal()
  return { meta, result }
}

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findByIdAndUpdate(id)
  return result
}

const updateSingleAdminFromDB = async (id: string, data: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = data
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  console.log(modifiedUpdatedData)

  const result = await Admin.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
  })

  return result
}

const deleteSingleAdminIntoDB = async (id: string) => {
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    )

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin')
    }

    const userId = deletedAdmin.user

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

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateSingleAdminFromDB,
  deleteSingleAdminIntoDB,
}
