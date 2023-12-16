import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourses.interface'
import { OfferedCourse } from './offeredCourses.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { hasTimeConflict } from './offeredCourses.utils'
import QueryBuilder from '../../builder/QueryBuilder'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // check if the  semester regestration exists or not
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester

  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found')
  }

  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found')
  }

  const isCourseExists = await Course.findById(course)
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  //check if the department belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    academicFaculty,
    _id: academicDepartment,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This ${isAcademicDepartmentExists.name} does not belong to the ${isAcademicFacultyExists.name}`,
    )
  }

  //check if same course has same two sections
  const isSameSectionForSameCourse = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  })

  if (isSameSectionForSameCourse) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Course with same section exists`,
    )
  }

  //get the schedule of the faculties
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')
  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Time clashed. Please choose another time or day.`,
    )
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester })
  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourses = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await offeredCourses.modelQuery
  return result
}

const getSingleOfferedCoursesIntoDB = async (id: string) => {
  const result = await OfferedCourse.findById(id)
  return result
}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload
  const isOfferedCourse = await OfferedCourse.findById(id)
  if (!isOfferedCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }
  // console.log(isOfferedCourse)

  const semesterRegistration = isOfferedCourse.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration)

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot update the semester as it is ${semesterRegistrationStatus?.status}`,
    )
  }
  //get the schedule of the faculties
  const assignSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')
  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Time clashed. Please choose another time or day.`,
    )
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

const deleteOfferedCourseIntoDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */

  const isOfferedCourseExists = await OfferedCourse.findById(id)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'offered course does not exist')
  }

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('status')

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'semester registration is not UPCOMING. you cannot delete that',
    )
  }
  const result = await OfferedCourse.findByIdAndDelete(id)
  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCoursesIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseIntoDB,
}
