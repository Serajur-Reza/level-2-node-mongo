import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { courseSearchableFields } from './course.constants'
import { TCourse, TCourseFaculty } from './course.interface'
import { Course, CourseFaculty } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const couresQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await couresQuery.modelQuery
  return result
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}

const createCourseIntoDB = async (body: TCourse) => {
  const result = await Course.create(body)
  return result
}

const updateCourseIntoDB = async (id: string, body: Partial<TCourse>) => {
  // const result = await Course.create(body)
  // return result

  const { preRequisiteCourses, ...courseRemainingData } = body

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    //step-1 - basic course update
    const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    )

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
    }
    if (preRequisiteCourses && preRequisiteCourses.length) {
      const deletedPreRequisites = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course)

      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      )

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
      }

      const newPreRequisites = preRequisiteCourses?.filter(
        el => el.course && !el.isDeleted,
      )

      console.log({ newPreRequisites })

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        { new: true, runValidators: true, session },
      )

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
      }
    }

    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    )

    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'failed to update course')
  }
}

const deleteSingleCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  )

  return result
}

const removeFacultiesFromCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { upsert: true, new: true },
  )

  return result
}

export const courseServices = {
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  createCourseIntoDB,
  updateCourseIntoDB,
  deleteSingleCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseIntoDB,
}
