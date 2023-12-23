import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EnrolledCoursesServices } from './enrolledCourses.service'

const getAllEnrolledCourses = catchAsync(async (req, res) => {
  const result = await EnrolledCoursesServices.getAllEnrolledCourseFromDB()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'enrolled courses found successfully',
    data: result,
  })
})

const createEnrolledCourse = catchAsync(async (req, res) => {
  console.log('Student:', req.user)
  const { userId } = req.user
  const result = await EnrolledCoursesServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'enrolled course created successfully',
    data: result,
  })
})

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId
  const result = await EnrolledCoursesServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'enrolled course marks updated successfully',
    data: result,
  })
})

export const EnrolledCoursesControllers = {
  getAllEnrolledCourses,
  createEnrolledCourse,
  updateEnrolledCourseMarks,
}