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
import { Student } from '../student/student.model'

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
  const meta = await offeredCourses.countTotal()
  return { meta, result }
}

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  //pagination setup
  const page = Number(query?.page) || 1
  const limit = Number(query?.limit) || 10
  const skip = (page - 1) * limit

  //get student
  const student = await Student.findOne({ id: userId })

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'user is not found')
  }

  //current ongoing semester
  const currentOnGoingRegistrationSemester = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  )

  if (!currentOnGoingRegistrationSemester) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'There is no semester registration on going',
    )
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOnGoingRegistrationSemester?._id,
        academicDepartment: student?.academicDepartment,
        academicFaculty: student?.academicFaculty,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOnGoingRegistrationSemester:
            currentOnGoingRegistrationSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOnGoingRegistrationSemester',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },

    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },

    {
      $addFields: {
        isPreRequisiteFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisiteFulFilled: true,
      },
    },
  ]

  const pagination = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...pagination,
  ])
  const total = (await OfferedCourse.aggregate(aggregationQuery)).length
  const totalPage = Math.ceil(result.length / limit)

  return { meta: { page, limit, total, totalPage }, result }
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
  getMyOfferedCoursesFromDB,
  getSingleOfferedCoursesIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseIntoDB,
}
