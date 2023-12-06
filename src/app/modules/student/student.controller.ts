import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StudentServices } from './student.service'
// import StudentValidations from './student.validation'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import catchAsync from '../../middlewares/catchAsync'

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully',
    data: result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.getSingleStudentFromDB(req.params.id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  })
})

const updateSingleStudent = catchAsync(async (req, res) => {
  // const { id } = req.params
  // const { student } = req.body
  const result = await StudentServices.updateStudentFromDB(
    req.params.id,
    req.body.student,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully',
    data: result,
  })
})

const deleteSingleStudent = catchAsync(async (req, res) => {
  const result = await StudentServices.deleteStudentFromDB(req.params.id)

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
  updateSingleStudent,
  deleteSingleStudent,
}
