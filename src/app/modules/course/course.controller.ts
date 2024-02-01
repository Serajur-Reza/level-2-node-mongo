import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'
import { courseServices } from './course.service'

const getAllCourses = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.getAllCoursesFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All courses found successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.getSingleCourseFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course found successfully',
    data: result,
  })
})

const createCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.createCourseIntoDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course added successfully',
    data: result,
  })
})

const updateCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.updateCourseIntoDB(
    req.params.id,
    req.body,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course edited successfully',
    data: result,
  })
})

const deleteCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.deleteSingleCourseFromDB(req.params.id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully',
    data: result,
  })
})

const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const result = await courseServices.getFacultiesWithCourseFromDB(
    req.params.courseId,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculties retrieved successfully',
    data: result,
  })
})

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.assignFacultiesWithCourseIntoDB(
    req.params.courseId,
    req.body.faculties,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculties added successfully',
    data: result,
  })
})

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  //   const { password, student: studentData } = req.body

  const result = await courseServices.removeFacultiesFromCourseIntoDB(
    req.params.courseId,
    req.body.faculties,
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculties removed successfully',
    data: result,
  })
})

export const courseControllers = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getFacultiesWithCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
}
