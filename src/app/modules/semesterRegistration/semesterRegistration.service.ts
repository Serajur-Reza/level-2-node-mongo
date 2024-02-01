import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { AcademicSemester } from '../academicSemester/academicSemester.model'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistration } from './semesterRegistration.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { RegistrationStatus } from './semsterRegistration.constants'
import mongoose from 'mongoose'
import { OfferedCourse } from '../offeredCourses/offeredCourses.model'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester

  //check if there is any semesters upcoming or ongoing
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    })

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already a registered ${isThereAnyUpcomingOrOngoingSemester.status} semester`,
    )
  }
  //check if there is any academic semester exists
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester)
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester is not found',
    )
  }

  //check if a semester exists
  const isRegistrationSemesterExists = await SemesterRegistration.findOne({
    academicSemester,
  })

  if (isRegistrationSemesterExists) {
    throw new AppError(httpStatus.CONFLICT, 'Semester already exists')
  }

  const result = SemesterRegistration.create(payload)
  return result
}

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await semesterRegistrationQuery.modelQuery
  const meta = await semesterRegistrationQuery.countTotal()
  return { meta, result }
}

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id)
  return result
}

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if the requested semester exists or not
  const isRegistrationSemesterExists = await SemesterRegistration.findById(id)

  if (!isRegistrationSemesterExists) {
    throw new AppError(httpStatus.CONFLICT, 'Semester is not found')
  }
  //if the requested semester is ended we will not update that

  const currentSemesterStatus = isRegistrationSemesterExists?.status
  const requestedStatus = payload?.status

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    )
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot directly change from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot directly change from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  return result
}

const deleteSemesterRegistrationIntoDB = async (id: string) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()
    const isSemesterExists = await SemesterRegistration.findById(id)

    if (!isSemesterExists) {
      throw new Error('The semester does not exist')
    }

    if (isSemesterExists?.status !== 'UPCOMING') {
      throw new Error('The semester is not upcoming. you cannot delete this')
    }

    const deletedCourse = await OfferedCourse.deleteMany({
      semesterRegistration: id,
    })
    console.log('deletedId:', deletedCourse)
    const deletedSemester = await SemesterRegistration.findByIdAndDelete(id)

    session.commitTransaction()
    session.endSession()

    console.log('data:', { deletedSemester, deletedCourse })
    return { deletedSemester, deletedCourse }
  } catch (error) {
    session.abortTransaction()
    session.endSession()
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester cannot be deleted',
      error?.message,
    )
  }
}

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationIntoDB,
}
