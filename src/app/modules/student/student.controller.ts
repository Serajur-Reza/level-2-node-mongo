import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StudentServices } from './student.service'
// import StudentValidations from './student.validation'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB()
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getSingleStudentFromDB(
    req.params.studentId,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  })
})

const deleteSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.deleteStudentFromDB(req.params.studentId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  })
})

export const studentControllers = {
  getAllStudents,
  getSingleStudent,
  deleteSingleStudent,
}
