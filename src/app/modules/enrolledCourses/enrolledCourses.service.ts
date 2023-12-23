import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { OfferedCourse } from '../offeredCourses/offeredCourses.model'
import { TEnrolledCourses } from './enrolledCourses.interface'
import { EnrolledCourse } from './enrolledCourses.model'
import { Student } from '../student/student.model'
import mongoose from 'mongoose'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { Course } from '../course/course.model'
import { Faculty } from '../faculty/faculty.model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'

const getAllEnrolledCourseFromDB = async () => {
  const result = await EnrolledCourse.find()
  return result
}

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourses,
) => {
  // check if the offeredCourse exists
  const { offeredCourse } = payload
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is full')
  }
  // check if the student is already enrolled in the course
  const student = await Student.findOne({ id: userId }, { _id: 1 })
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists.semesterRegistration,
    offeredCourse,
    student: student?._id,
  })

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled')
  }

  //check total credit is more than max credit or not
  const courseExists = await Course.findById(isOfferedCourseExists.course)
  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit')

  const maxCredit = semesterRegistration?.maxCredit as number

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },

    {
      $unwind: '$enrolledCourseData',
    },

    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credit' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ])

  //total enrolled credits + new enrolled course credit > maxCredit

  const totalCredits = enrolledCourses.length
    ? enrolledCourses[0].totalEnrolledCredits
    : 0

  if (
    totalCredits &&
    maxCredit &&
    totalCredits + courseExists?.credit > maxCredit
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have reached your maximum credit limit',
    )
  }

  console.log(enrolledCourses)

  const session = await mongoose.startSession()

  try {
    // create an enrolled course

    session.startTransaction()

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to enroll in this course',
      )
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity - 1
    await OfferedCourse.findByIdAndUpdate(offeredCourse, { maxCapacity })

    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(error)
  }
}

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourses>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found')
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const isStudentExists = await Student.findById(student)
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found')
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })
  if (!faculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  })

  if (!isCourseBelongToFaculty) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden')
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } = courseMarks

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5)

    console.log(totalMarks)

    const result = calculateGradeAndPoints(totalMarks)
    console.log(result, totalMarks)

    modifiedData.grade = result.grade
    modifiedData.gradePoints = result.gradePoints
    modifiedData.isCompleted = true
  }
  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  )

  return result
}

export const EnrolledCoursesServices = {
  getAllEnrolledCourseFromDB,
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
}